import { DynamoDB } from "aws-sdk";
import { products } from "../mock-data/mock-data";

const dynamodb = new DynamoDB.DocumentClient({ region: "eu-west-1" });

const productsTable = "products";
const stocksTable = "stocks";

const populateProductsTable = async () => {
  for (const product of products) {
    const params = {
      TableName: productsTable,
      Item: product,
    };

    try {
      await dynamodb.put(params).promise();
      console.log(`Inserted product: ${product.title}`);
    } catch (error) {
      console.error(
        `Unable to insert product: ${product.title}. Error JSON:`,
        JSON.stringify(error, null, 2)
      );
    }
  }
};

const populateStocksTable = async () => {
  for (const product of products) {
    const params = {
      TableName: stocksTable,
      Item: {
        product_id: product.id,
        count: 10,
      },
    };

    try {
      await dynamodb.put(params).promise();
      console.log(`Inserted stock for product ID: ${product.id}`);
    } catch (error) {
      console.error(
        `Unable to insert stock for product ID: ${product.id}. Error JSON:`,
        JSON.stringify(error, null, 2)
      );
    }
  }
};

const main = async () => {
  await populateProductsTable();
  await populateStocksTable();
  console.log("Tables have been populated with test data.");
};

main().catch((error) => console.error(error));
