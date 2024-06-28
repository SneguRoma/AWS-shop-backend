import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as s3notifications from 'aws-cdk-lib/aws-s3-notifications';
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
    
    const importFileParserLambda = new lambda.Function(this, 'importFileParserLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'importFileParser.importFileParser',
      code: lambda.Code.fromAsset('lambda'),
    });
    
    existingBucket.grantReadWrite(importFileParserLambda);
    existingBucket.addEventNotification(s3.EventType.OBJECT_CREATED_PUT, new s3notifications.LambdaDestination(importFileParserLambda), {
      prefix: 'uploaded/',
    });
    
    
    importResource.addMethod(
      "GET",
      new apigw.LambdaIntegration(importProductsFileLambda)
    );
    
  }
}
