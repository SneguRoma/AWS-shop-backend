import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { headers } from "./constants";

const s3Client = new S3Client({region: "eu-west-1"});
const bucketName = process.env.BUCKET_NAME!;

export const importProductsList: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const fileName = event.queryStringParameters?.name;
    console.log("event", event);
  
    if (!fileName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "File name is required" }),
      };
    }
  
    const params = {
      Bucket: bucketName,
      Key: `uploaded/${fileName}`,
      ContentType: "text/csv",
    };
  
    try {
      const command = new PutObjectCommand(params);
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ url: signedUrl }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: "Error generating signed URL", error }),
      };
    }
  };