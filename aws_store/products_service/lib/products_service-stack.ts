import { Duration, Stack, StackProps } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { products } from "../mock-data/mock-data";

export class ProductsServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const productsTableName = "products";
    const stocksTableName = "stocks";

    const productsTable = dynamodb.Table.fromTableName(
      this,
      "productsTable",
      //process.env.PRODUCTS_TABLE || productsTableName
      productsTableName
    );

    const stocksTable = dynamodb.Table.fromTableName(
      this,
      "StocksTable",
      //process.env.STOCKS_TABLE || stocksTableName
      stocksTableName
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
          PRODUCTS: JSON.stringify(products),
        },
      }
    );

    productsTable.grantReadWriteData(getProductListLambda);
    stocksTable.grantReadWriteData(getProductListLambda);

    const api = new apigw.LambdaRestApi(this, "Endpoint", {
      handler: getProductListLambda,
      proxy: false,
    });

    const productsResource = api.root.addResource("products");
    productsResource.addMethod(
      "GET",
      new apigw.LambdaIntegration(getProductListLambda)
    );

    const product = productsResource.addResource("{id}");
    const getProductByIdIntegration = new apigw.LambdaIntegration(
      getProductByIDLambda
    );
    product.addMethod("GET", getProductByIdIntegration);
  }
}
