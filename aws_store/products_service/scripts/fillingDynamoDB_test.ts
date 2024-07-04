import { DynamoDB } from "aws-sdk";
import { products as initialProducts } from "../mock-data/mock-data";
import { v4 as uuidv4 } from "uuid";

interface ProductWithId {
  id: string;
  title: string;
  description: string;
  price: number;
}

const dynamodb = new DynamoDB.DocumentClient({ region: "eu-west-1" });

const productsTable = "products";
const stocksTable = "stocks";

const populateProductsTable = async (products: ProductWithId[]) => {
  for (const product of products) {
    const params = {
      TableName: productsTable,
      Item: product,
    };

    try {
      await dynamodb.put(params).promise();
      console.log(`Inserted product: ${product.title} with ID: ${product.id}`);
    } catch (error) {
      console.error(
        `Unable to insert product: ${product.title}. Error JSON:`,
        JSON.stringify(error, null, 2)
      );
    }
  }
};

const populateStocksTable = async (products: ProductWithId[]) => {
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
  const productsWithId = initialProducts.map((product) => ({
    ...product,
    id: uuidv4(),
  }));

  await populateProductsTable(productsWithId);
  await populateStocksTable(productsWithId);
  console.log("Tables have been populated with test data.");
};

main().catch((error) => console.error(error));
