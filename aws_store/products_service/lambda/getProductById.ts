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
    if (!productId) {
      return {
        statusCode: 400,
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
      body: JSON.stringify({ ...product, count: stock ? stock.count : 0 }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
      }),
    };
  }
};
