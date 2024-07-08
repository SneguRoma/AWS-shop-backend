import { S3Handler } from "aws-lambda";
import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import * as csv from "csv-parser";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Readable } from "stream";

const s3Client = new S3Client({});
const sqsClient = new SQSClient({});
const queueUrl = process.env.CATALOG_ITEMS_QUEUE_URL!;

export const importFileParser: S3Handler = async (event) => {
    
    console.log('Received event:', JSON.stringify(event, null, 2));
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;
  

  try {
    
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const response = await s3Client.send(command);
    const stream = response.Body as Readable;
    const results: any[] = []  

      await new Promise<void>((resolve, reject) => {
        stream.pipe(csv())
        .on("data", (data) => {
            results.push(data);
        })
        .on("end", async () => {
            console.log("File parsed successfully");

            for (const record of results) {
              console.log('record',record)
                const params = {
                    QueueUrl: queueUrl,
                    MessageBody: JSON.stringify(record)
                };

                try {
                    const sendMessageCommand = new SendMessageCommand(params);
                    console.log('sendMessageCommand',sendMessageCommand)
                    await sqsClient.send(sendMessageCommand);
                    console.log("Message sent to SQS:", JSON.stringify(record));
                } catch (error) {
                    console.error("Error sending message to SQS:", error);
                }
            }

            resolve();
        })
        .on("error", (error) => {
            reject(error);
        });
      });

      const newKey = key.replace('uploaded/', 'parsed/');
        const copyCommand = new CopyObjectCommand({
          Bucket: bucket,
          CopySource: `${bucket}/${key}`,
          Key: newKey,
        });
        await s3Client.send(copyCommand);
        console.log(`File copied to ${newKey}`);

        const deleteCommand = new DeleteObjectCommand({ Bucket: bucket, Key: key });
        await s3Client.send(deleteCommand);
        console.log(`File deleted from ${key}`); 
              

  } catch (error) {
    console.error("Error parsing file:", error);
  }
};
