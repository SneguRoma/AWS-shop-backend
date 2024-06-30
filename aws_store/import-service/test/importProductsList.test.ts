import { APIGatewayProxyEvent } from 'aws-lambda';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { importProductsList } from '../lambda/importProductsList';


const s3Mock = mockClient(S3Client);

describe('importProductsList', () => {
  beforeEach(() => {
    s3Mock.reset();
  });

  it('should return a signed URL for a valid file name', async () => {
   
    const signedUrl = 'https://example.com/signed-url';
    (getSignedUrl as jest.Mock).mockResolvedValue(signedUrl);

    const event = {
      queryStringParameters: {
        name: 'test.csv',
      },
    } as unknown as APIGatewayProxyEvent;

    const response = await importProductsList(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ url: signedUrl });
  });

  it('should return a 400 error if file name is missing', async () => {
    const event = {
      queryStringParameters: {},
    } as unknown as APIGatewayProxyEvent;

    const response = await importProductsList(event);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({ message: 'File name is required' });
  });

  it('should return a 500 error if there is an issue generating the signed URL', async () => {
    
    const errorMessage = 'Error generating signed URL';
    (getSignedUrl as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const event = {
      queryStringParameters: {
        name: 'test.csv',
      },
    } as unknown as APIGatewayProxyEvent;

    const response = await importProductsList(event);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe(errorMessage);
  });
});
