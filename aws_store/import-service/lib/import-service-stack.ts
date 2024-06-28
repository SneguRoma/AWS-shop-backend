import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucketName = "my-bucket-to-import-service";
    const existingBucket = s3.Bucket.fromBucketName(
      this,
      "ExistingBucket",
      bucketName
    );

    const importProductsFileLambda = new lambda.Function(
      this,
      "Get-Products-List-Lambda",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        code: lambda.Code.fromAsset("lambda"),
        handler: "importProductsList.importProductsList",
        environment: {
          BUCKET_NAME: bucketName,
        },
      }
    );

    existingBucket.grantReadWrite(importProductsFileLambda);

    const api = new apigw.RestApi(this, "ImportApi", {
      restApiName: "Import Service",
    });

    const importResource = api.root.addResource("import");

    importResource.addMethod(
      "GET",
      new apigw.LambdaIntegration(importProductsFileLambda)
    );
  }
}
