# AWS-shop-backend

# Welcome to my CDK TypeScript project

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`ProductsServiceStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## To Deploy this app

* cd products_service
* cdk synth
* cdk diff
* npm run build

## To fill Tables run script

* ts-node scripts/fillingDynamoDB.ts

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
