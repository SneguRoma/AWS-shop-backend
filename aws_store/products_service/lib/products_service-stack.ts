import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import { Construct } from "constructs";

export class ProductsServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const productsTable = dynamodb.Table.fromTableName(
      this,
      "productsTable",
      "products"
    );

    const stocksTable = dynamodb.Table.fromTableName(
      this,
      "StocksTable",
      "stocks"
    );
    const getProductListLambda = new lambda.Function(
      this,
      "Get-Products-List-Lambda",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        code: lambda.Code.fromAsset("lambda"),
        handler: "getProducts.getProductsList",
        environment: {
          PRODUCTS_TABLE: productsTable.tableName,
          STOCKS_TABLE: stocksTable.tableName,
        },
      }
    );

    
    const getProductByIDLambda = new lambda.Function(
      this,
      "Get-Product-BY-ID-Lambda",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        code: lambda.Code.fromAsset("lambda"),
        handler: "getProductById.getProductById",
        environment: {
          PRODUCTS_TABLE: productsTable.tableName,
          STOCKS_TABLE: stocksTable.tableName,
        },
      }
    );

    
    const createProductLambda = new lambda.Function(
      this,
      "Create-Product-Lambda",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        code: lambda.Code.fromAsset("lambda"),
        handler: "createProduct.createProduct",
        environment: {
          PRODUCTS_TABLE: productsTable.tableName,
          STOCKS_TABLE: stocksTable.tableName,
        },
      }
    );

    const catalogItemsQueue = new sqs.Queue(this, "CatalogItemsQueue", {
      queueName: "catalog-items-queue",
      visibilityTimeout: Duration.seconds(300),
    });

    const catalogBatchProcess = new lambda.Function(
      this,
      "CatalogBatchProcess",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "catalogBatchProcess.catalogBatchProcess",
        code: lambda.Code.fromAsset("lambda"),
        environment: {
          CATALOG_ITEMS_QUEUE_URL: catalogItemsQueue.queueUrl,
          PRODUCTS_TABLE: productsTable.tableName,
          STOCKS_TABLE: stocksTable.tableName,
        },
      }
    );

    
    catalogBatchProcess.addEventSource(new lambdaEventSources.SqsEventSource(catalogItemsQueue, {
      batchSize: 5
    }));

    new CfnOutput(this, 'CatalogItemsQueueUrl', {
      value: catalogItemsQueue.queueUrl,
      exportName: 'CatalogItemsQueueUrl',
    });

    new CfnOutput(this, 'CatalogItemsQueueArn', {
      value: catalogItemsQueue.queueArn,
      exportName: 'CatalogItemsQueueArn',
    });
    
    productsTable.grantReadWriteData(getProductListLambda);
    stocksTable.grantReadWriteData(getProductListLambda);
    productsTable.grantReadWriteData(getProductByIDLambda);
    stocksTable.grantReadWriteData(getProductByIDLambda);
    productsTable.grantReadWriteData(createProductLambda);
    stocksTable.grantReadWriteData(createProductLambda);
    catalogItemsQueue.grantConsumeMessages(catalogBatchProcess);
    productsTable.grantReadWriteData(catalogBatchProcess);
    stocksTable.grantReadWriteData(catalogBatchProcess);

    const api = new apigw.LambdaRestApi(this, "Endpoint", {
      handler: getProductListLambda,
      proxy: false,
    });

    const productsResource = api.root.addResource("products");
    productsResource.addMethod(
      "GET",
      new apigw.LambdaIntegration(getProductListLambda)
    );
    productsResource.addMethod(
      "PUT",
      new apigw.LambdaIntegration(createProductLambda)
    );

    const product = productsResource.addResource("{id}");
    const getProductByIdIntegration = new apigw.LambdaIntegration(
      getProductByIDLambda
    );
    product.addMethod("GET", getProductByIdIntegration);
  }
}
