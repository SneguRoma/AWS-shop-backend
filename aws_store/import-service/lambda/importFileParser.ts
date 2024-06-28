import { S3Handler } from "aws-lambda";
import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import * as csv from "csv-parser";
import { Readable } from "stream";

const s3Client = new S3Client({});

export const importFileParser: S3Handler = async (event) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const response = await s3Client.send(command);
    const stream = response.Body as Readable;

    stream.pipe(csv())
      .on("data", (data) => {
        console.log("Parsed data:", data);
      })
      .on("end", () => {
        console.log("File parsed successfully");
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
