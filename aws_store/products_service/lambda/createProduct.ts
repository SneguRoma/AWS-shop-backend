import { APIGatewayProxyHandler } from "aws-lambda";
import { headers, productsTable, stocksTable } from "./constants";
import { createProductByBody } from "./helpers";

export const createProduct: APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return { statusCode: 400, headers, body: "invalid request" };
  }
  try {
    const result = await createProductByBody(
      event.body,
      process.env.PRODUCTS_TABLE || productsTable,
      process.env.STOCKS_TABLE || stocksTable
    );

    return result;
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
