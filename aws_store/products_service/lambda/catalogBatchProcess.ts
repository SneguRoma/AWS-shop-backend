import { SQSHandler } from "aws-lambda";
import * as AWS from "aws-sdk";
import { createProductByBody } from "./helpers";
import { productsTable, stocksTable } from "./constants";

const sns = new AWS.SNS();
const createProductTopicArn = process.env.CREATE_PRODUCT_TOPIC_ARN;

export const catalogBatchProcess: SQSHandler = async (event) => {
  for (const record of event.Records) {
    try {
      const product = record.body;

      await createProductByBody(
        product,
        process.env.PRODUCTS_TABLE || productsTable,
        process.env.STOCKS_TABLE || stocksTable
      );
      const message = {
        Subject: "New product created",
        Message: JSON.stringify({ product }),
        TopicArn: createProductTopicArn,
      };

      await sns.publish(message).promise();
    } catch (error) {
      console.error("Error processing SQS message", error);
    }
  }
};
