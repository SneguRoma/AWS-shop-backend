import { APIGatewayProxyResult } from 'aws-lambda';
import { products } from '../mock-data/mock-data';
import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const productsTable = "products";
const stocksTable = "stocks";

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
    try {
        const productsResult = await dynamoDb.scan({ TableName:/*  process.env.PRODUCTS_TABLE | |*/ productsTable }).promise();
      const stocksResult = await dynamoDb.scan({ TableName:/*  process.env.STOCKS_TABLE || */  stocksTable}).promise();
  
      const products = productsResult.Items;
      const stocks = stocksResult.Items;
  
      if(products && stocks){
        const combinedProducts = products.map(product => {
        const stock = stocks.find(stock => stock.product_id === product.id);
        return { ...product, count: stock ? stock.count : 0 };
      });
    
  
      return {
        statusCode: 200,
        body: JSON.stringify(combinedProducts),
      };
    }
    else
     return {
        statusCode: 404,
        body: 'products not found',
      };
    } catch (error) {
        console.error(error);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Internal Server Error' }),
        };
      }
};


