import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult, Callback } from "aws-lambda";
import { headers } from "../lambda/constants";
import { importProductsList } from "../lambda/importProductsList";

jest.mock("@aws-sdk/client-s3");
jest.mock("@aws-sdk/s3-request-presigner");

describe("importProductsList", () => {
  const s3ClientMock = S3Client as jest.MockedClass<typeof S3Client>;
  const getSignedUrlMock = getSignedUrl as jest.MockedFunction<typeof getSignedUrl>;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.BUCKET_NAME = "my-test-bucket";
  });

  const context: Context = {} as Context;
  const callback: Callback<APIGatewayProxyResult> = () => {};

  it("should return 400 if file name is not provided", async () => {
    const event = {
      queryStringParameters: null,
    } as unknown as APIGatewayProxyEvent;

    const result = await new Promise<APIGatewayProxyResult>((resolve) => {
      importProductsList(event, context, (error, result) => {
        if (error) throw error;
        resolve(result!);
      });
    });

    expect(result.statusCode).toBe(400);
    expect(result.headers).toEqual(headers);
    expect(JSON.parse(result.body)).toEqual({ message: "File name is required" });
  }, 10000);

  it("should return 200 with signed URL if file name is provided", async () => {
    const event = {
      queryStringParameters: { name: "test.csv" },
    } as unknown as APIGatewayProxyEvent;

    const mockSignedUrl = "https://signed-url.com";
    getSignedUrlMock.mockResolvedValue(mockSignedUrl);

    const result = await new Promise<APIGatewayProxyResult>((resolve) => {
      importProductsList(event, context, (error, result) => {
        if (error) throw error;
        resolve(result!);
      });
    });

    expect(result.statusCode).toBe(200);
    expect(result.headers).toEqual(headers);
    expect(JSON.parse(result.body)).toEqual({ url: mockSignedUrl });
    expect(getSignedUrlMock).toHaveBeenCalledTimes(1);
    expect(getSignedUrlMock).toHaveBeenCalledWith(expect.any(S3Client), expect.any(PutObjectCommand), { expiresIn: 3600 });
  }, 10000);

  it("should return 500 if there is an error generating signed URL", async () => {
    const event = {
      queryStringParameters: { name: "test.csv" },
    } as unknown as APIGatewayProxyEvent;

    getSignedUrlMock.mockRejectedValue(new Error("Error generating signed URL"));

    const result = await new Promise<APIGatewayProxyResult>((resolve) => {
      importProductsList(event, context, (error, result) => {
        if (error) throw error;
        resolve(result!);
      });
    });

    expect(result.statusCode).toBe(500);
    expect(result.headers).toEqual(headers);
    expect(JSON.parse(result.body)).toEqual({ message: "Error generating signed URL", error: "Error generating signed URL" });
  }, 10000);
});
