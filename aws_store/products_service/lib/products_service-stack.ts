import { Duration, Stack, StackProps } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
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

    productsTable.grantReadWriteData(getProductListLambda);
    stocksTable.grantReadWriteData(getProductListLambda);
    productsTable.grantReadWriteData(getProductByIDLambda);
    stocksTable.grantReadWriteData(getProductByIDLambda);
    productsTable.grantReadWriteData(createProductLambda);
    stocksTable.grantReadWriteData(createProductLambda);

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
      "POST",
      new apigw.LambdaIntegration(createProductLambda)
    );

    const product = productsResource.addResource("{id}");
    const getProductByIdIntegration = new apigw.LambdaIntegration(
      getProductByIDLambda
    );
    product.addMethod("GET", getProductByIdIntegration);
  }
}
