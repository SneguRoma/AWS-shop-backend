import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";

export class AuthorizationServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaRole = new iam.Role(this, "BasicAuthorizerRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });

    lambdaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AWSLambdaBasicExecutionRole"
      )
    );

    lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "execute-api:Invoke",
          "lambda:InvokeFunction",
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        resources: ["*"],
      })
    );

    const basicAuthorizer = new lambda.Function(this, "BasicAuthorizer", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "basicAuthorizer.basicAuthorizer",
      code: lambda.Code.fromAsset("lambda"),
      environment: {
        SNEGUROMA: "TEST_PASSWORD",
      },
      role: lambdaRole,
    });

    /* const lambdaPolicy = new iam.PolicyStatement({
      actions: ['execute-api:Invoke'],
      resources: [basicAuthorizer.functionArn],
    });

    basicAuthorizer.addToRolePolicy(lambdaPolicy); */
    const apiGatewayInvokePermission = new lambda.CfnPermission(
      this,
      "ApiGatewayInvokePermission",
      {
        action: "lambda:InvokeFunction",
        functionName: basicAuthorizer.functionArn,
        principal: "apigateway.amazonaws.com",
        sourceArn: `arn:aws:execute-api:${this.region}:${this.account}:*`,
      }
    );

    new cdk.CfnOutput(this, "BasicAuthorizerArn", {
      value: basicAuthorizer.functionArn,
      exportName: "BasicAuthorizerArn",
    });
  }
}
