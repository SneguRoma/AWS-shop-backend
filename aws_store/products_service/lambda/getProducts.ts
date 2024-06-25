import { APIGatewayProxyResult } from "aws-lambda";
import { products } from "../mock-data/mock-data";
import * as AWS from "aws-sdk";
import { headers, productsTable, stocksTable } from "./constants";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Incoming request: getallProducts");
    const productsResult = await dynamoDb
      .scan({ TableName: process.env.PRODUCTS_TABLE || productsTable })
      .promise();
    const stocksResult = await dynamoDb
      .scan({ TableName: process.env.STOCKS_TABLE || stocksTable })
      .promise();

    const products = productsResult.Items;
    const stocks = stocksResult.Items;

    if (products && stocks) {
      const combinedProducts = products.map((product) => {
        const stock = stocks.find((stock) => stock.product_id === product.id);
        return { ...product, count: stock ? stock.count : 0 };
      });

      return {
        statusCode: 200,
        body: JSON.stringify(combinedProducts),
        headers,
      };
    } else
      return {
        statusCode: 404,
        headers,
        body: "products not found",
      };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: `something wrong - error ${err}` }),
    };
  }
};
