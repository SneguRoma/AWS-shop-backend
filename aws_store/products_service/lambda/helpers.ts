import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { headers } from "./constants";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const createProductByBody =async(event:string, productsTable: string, stocksTable: string) => {
    const { title, description, price, count } = JSON.parse(event);
    const id = uuidv4();
try{

    const newProduct = {
      id,
      title,
      description,
      price,
    };

    const newStock = {
      product_id: id,
      count,
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

      console.error(error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: "Internal Server Error" }),
      };
    }

}