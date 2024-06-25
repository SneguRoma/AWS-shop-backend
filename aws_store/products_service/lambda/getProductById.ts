import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";
import { headers, productsTable, stocksTable } from "./constants";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const getProductById = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Incoming request:", event);
    const productId = event.pathParameters?.id;

    if (!productId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Product ID is required" }),
      };
    }

    const productResult = await dynamoDb
      .get({
        TableName: process.env.PRODUCTS_TABLE || productsTable,
        Key: { id: productId },
      })
      .promise();

    if (!productResult.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: "Product not found" }),
      };
    }
    const stockResult = await dynamoDb
      .get({
        TableName: process.env.STOCKS_TABLE || stocksTable,
        Key: { product_id: productId },
      })
      .promise();

    const product = productResult.Item;
    const stock = stockResult.Item;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ...product, count: stock ? stock.count : 0 }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: `something wrong - error ${err}`,
      }),
    };
  }
};
