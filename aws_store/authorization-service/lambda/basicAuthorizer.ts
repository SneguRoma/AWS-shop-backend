import { config } from "dotenv";
import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
  PolicyDocument,
} from "aws-lambda";
config();

export const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  console.log("Event:", event);

  if (!event.authorizationToken) {
    console.error("No authorization token");
    return generatePolicy("user", "Deny", event.methodArn, 401);
  }

  const token = event.authorizationToken.split(" ")[1];
  const [username, password] = Buffer.from(token, "base64")
    .toString('utf-8')
    .split(":");

  console.log("Username:", username);
  console.log("Password:", password);
  console.log("Env variable:", process.env[username]);

  if (/* process.env[username] */ "TEST_PASSWORD" === password) {
    console.log("Authorized");
    return generatePolicy(username, "Allow", event.methodArn);
  } else {
    console.error("Unauthorized");
    return generatePolicy(username, "Deny", event.methodArn, 403);
  }
};

const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string,
  statusCode: number = 200
): APIGatewayAuthorizerResult => {
  const policyDocument: PolicyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect as "Allow" | "Deny",
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
