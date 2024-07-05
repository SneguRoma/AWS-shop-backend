import { SQSHandler } from "aws-lambda";

import { createProductByBody } from "./helpers";
import { productsTable, stocksTable } from "./constants";

export const catalogBatchProcess: SQSHandler = async (event) => {
  for (const record of event.Records) {
    const product = record.body;

    await createProductByBody(
      product,
      process.env.PRODUCTS_TABLE || productsTable,
      process.env.STOCKS_TABLE || stocksTable
    );
  }
};
