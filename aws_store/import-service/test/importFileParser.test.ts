import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { Context, APIGatewayProxyEvent, APIGatewayProxyResult, Callback, S3Event } from 'aws-lambda';
import { importFileParser } from '../lambda/importFileParser';


jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn(() => ({
    send: jest.fn().mockImplementation((command) => {
      if (command instanceof GetObjectCommand) {
       
        const stream = Readable.from([Buffer.from('mock,csv,data\n')]);
        return Promise.resolve({ Body: stream });
      } else if (command instanceof CopyObjectCommand || command instanceof DeleteObjectCommand) {
        
        return Promise.resolve({});
      } else {
        throw new Error(`Unsupported command: ${command}`);
      }
    }),
  })),
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
}));

describe('importFileParser', () => {
  it('should parse file, copy to "parsed" folder, and delete original file', async () => {
    
    const mockEvent: S3Event = {
      Records: [
        {
          eventVersion: '2.1',
          eventSource: 'aws:s3',
          awsRegion: 'us-east-1',
          eventTime: '2024-07-01T00:00:00.000Z',
          eventName: 'ObjectCreated:Put',
          userIdentity: {
            principalId: 'EXAMPLE'
          },
          requestParameters: {
            sourceIPAddress: '127.0.0.1'
          },
          responseElements: {
            'x-amz-request-id': 'EXAMPLE123456789',
            'x-amz-id-2': 'EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH'
          },
          s3: {
            s3SchemaVersion: '1.0',
            configurationId: 'testConfigRule',
            bucket: {
              name: 'test-bucket',
              ownerIdentity: {
                principalId: 'EXAMPLE'
              },
              arn: 'arn:aws:s3:::test-bucket'
            },
            object: {
              key: 'uploaded/test.csv',
              size: 1024,
              eTag: '0123456789abcdef0123456789abcdef',
              versionId: '1',
              sequencer: '0A1B2C3D4E5F678901'
            }
          }
        }
      ]
    };

   
    const context: Context = {} as Context;
    const callback: Callback<void> = () => {};

   
    await importFileParser(mockEvent, context, callback);

    
    expect(S3Client.prototype.send).toHaveBeenCalledTimes(3); 
    expect(S3Client.prototype.send).toHaveBeenCalledWith(expect.any(GetObjectCommand));
    expect(S3Client.prototype.send).toHaveBeenCalledWith(expect.any(CopyObjectCommand));
    expect(S3Client.prototype.send).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
  });
});
