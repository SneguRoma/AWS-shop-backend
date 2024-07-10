import { config } from 'dotenv';
import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent, PolicyDocument } from 'aws-lambda';
config();

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  if (!event.authorizationToken) {
    return generatePolicy('user', 'Deny', event.methodArn, 401);
  }

  const token = event.authorizationToken.split(' ')[1]; // Assuming the format is "Basic <base64>"
  const [username, password] = Buffer.from(token, 'base64')
    .toString()
    .split(':');

  if (process.env[username] === password) {
    return generatePolicy(username, 'Allow', event.methodArn);
  } else {
    return generatePolicy(username, 'Deny', event.methodArn, 403);
  }
};

const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string,
  statusCode: number = 200
): APIGatewayAuthorizerResult => {
  const policyDocument: PolicyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect as 'Allow' | 'Deny',
        Resource: resource,
      },
    ],
  };

  return {
    principalId,
    policyDocument,
    context: {
      statusCode: statusCode.toString(),
    },
  };
};