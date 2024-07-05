import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { headers } from "./constants";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

type newProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
};

type newStock = {
  product_id: string;
  count: number;
};

export const createProductByBody = async (
  event: string,
  productsTable: string,
  stocksTable: string
) => {
  const { title, description, price, count } = JSON.parse(event);
  const parsedPrice = parseFloat(price);
  const parsedCount = parseInt(count, 10);
  const id = uuidv4();

  try {
    const newProduct: newProduct = {
      id,
      title,
      description,
      price: parsedPrice,
    };

    const newStock: newStock = {
      product_id: id,
      count: parsedCount,
    };

    await dynamoDb
      .put({
        TableName: productsTable,
        Item: newProduct,
      })
      .promise();

    await dynamoDb
      .put({
        TableName: stocksTable,
        Item: newStock,
      })
      .promise();
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Product created successfully",
        headers,
        product: newProduct,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
