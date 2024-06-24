import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { products } from "../mock-data/mock-data";
import * as AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const productsTable = "products";
const stocksTable = "stocks";

export const getProductById = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
      const productId = event.pathParameters?.id;
      console.log('productId', productId);
      console.log('type of productId', (typeof productId));

    if (!productId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Product ID is required" }),
      };
    }

    const productResult = await dynamoDb
      .get({
        TableName:/*  process.env.PRODUCTS_TABLE || */ productsTable,
        Key: { id: productId },
      })
      .promise();
      console.log('productResult', productResult);

    if (!productResult.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Product not found" }),
      };
    }
    const stockResult = await dynamoDb
      .get({
        TableName: /* process.env.STOCKS_TABLE || */ stocksTable,
        Key: { product_id: productId },
      })
      .promise();
      console.log('stockResult', stockResult);

    const product = productResult.Item;
    const stock = stockResult.Item;

    console.log('product', stockResult);
    console.log('stock', stock);

    return {
      statusCode: 200,
      body: JSON.stringify({ ...product, count: stock ? stock.count : 0 }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `"something wrong " error ${err}`,
      }),
    };
  }
};
