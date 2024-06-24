import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
//import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

/* export const createProduct: APIGatewayProxyHandler = async (event) => {
  try {
    const { title, description, price, count } = JSON.parse(event.body);
    const id = uuidv4();

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

    await dynamoDb.put({
      TableName: process.env.PRODUCTS_TABLE,
      Item: newProduct
    }).promise();

    await dynamoDb.put({
      TableName: process.env.STOCKS_TABLE,
      Item: newStock
    }).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Product created successfully', product: newProduct }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
 */