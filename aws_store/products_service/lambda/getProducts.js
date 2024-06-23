"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsList = void 0;
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const productsTable = "products";
const stocksTable = "stocks";
const getProductsList = async () => {
    try {
        const productsResult = await dynamoDb.scan({ TableName: /*  process.env.PRODUCTS_TABLE | |*/ productsTable }).promise();
        const stocksResult = await dynamoDb.scan({ TableName: /*  process.env.STOCKS_TABLE || */ stocksTable }).promise();
        const products = productsResult.Items;
        const stocks = stocksResult.Items;
        if (products && stocks) {
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
    }
    catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
exports.getProductsList = getProductsList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UHJvZHVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnZXRQcm9kdWN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSwrQkFBK0I7QUFFL0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBRW5ELE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQztBQUNqQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUM7QUFFdEIsTUFBTSxlQUFlLEdBQUcsS0FBSyxJQUFvQyxFQUFFO0lBQ3RFLElBQUksQ0FBQztRQUNELE1BQU0sY0FBYyxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBQyxvQ0FBb0MsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3pILE1BQU0sWUFBWSxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBQyxrQ0FBa0MsQ0FBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRWpILE1BQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUM7UUFDdEMsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQztRQUVsQyxJQUFHLFFBQVEsSUFBSSxNQUFNLEVBQUMsQ0FBQztZQUNyQixNQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ2hELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDcEUsT0FBTyxFQUFFLEdBQUcsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ3hELENBQUMsQ0FBQyxDQUFDO1lBR0gsT0FBTztnQkFDTCxVQUFVLEVBQUUsR0FBRztnQkFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQzthQUN2QyxDQUFDO1FBQ0osQ0FBQzs7WUFFQSxPQUFPO2dCQUNKLFVBQVUsRUFBRSxHQUFHO2dCQUNmLElBQUksRUFBRSxvQkFBb0I7YUFDM0IsQ0FBQztJQUNKLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQixPQUFPO1lBQ0wsVUFBVSxFQUFFLEdBQUc7WUFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxDQUFDO1NBQzNELENBQUM7SUFDSixDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBaENXLFFBQUEsZUFBZSxtQkFnQzFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQVBJR2F0ZXdheVByb3h5UmVzdWx0IH0gZnJvbSAnYXdzLWxhbWJkYSc7XHJcbmltcG9ydCB7IHByb2R1Y3RzIH0gZnJvbSAnLi4vbW9jay1kYXRhL21vY2stZGF0YSc7XHJcbmltcG9ydCAqIGFzIEFXUyBmcm9tICdhd3Mtc2RrJztcclxuXHJcbmNvbnN0IGR5bmFtb0RiID0gbmV3IEFXUy5EeW5hbW9EQi5Eb2N1bWVudENsaWVudCgpO1xyXG5cclxuY29uc3QgcHJvZHVjdHNUYWJsZSA9IFwicHJvZHVjdHNcIjtcclxuY29uc3Qgc3RvY2tzVGFibGUgPSBcInN0b2Nrc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFByb2R1Y3RzTGlzdCA9IGFzeW5jICgpOiBQcm9taXNlPEFQSUdhdGV3YXlQcm94eVJlc3VsdD4gPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBwcm9kdWN0c1Jlc3VsdCA9IGF3YWl0IGR5bmFtb0RiLnNjYW4oeyBUYWJsZU5hbWU6LyogIHByb2Nlc3MuZW52LlBST0RVQ1RTX1RBQkxFIHwgfCovIHByb2R1Y3RzVGFibGUgfSkucHJvbWlzZSgpO1xyXG4gICAgICBjb25zdCBzdG9ja3NSZXN1bHQgPSBhd2FpdCBkeW5hbW9EYi5zY2FuKHsgVGFibGVOYW1lOi8qICBwcm9jZXNzLmVudi5TVE9DS1NfVEFCTEUgfHwgKi8gIHN0b2Nrc1RhYmxlfSkucHJvbWlzZSgpO1xyXG4gIFxyXG4gICAgICBjb25zdCBwcm9kdWN0cyA9IHByb2R1Y3RzUmVzdWx0Lkl0ZW1zO1xyXG4gICAgICBjb25zdCBzdG9ja3MgPSBzdG9ja3NSZXN1bHQuSXRlbXM7XHJcbiAgXHJcbiAgICAgIGlmKHByb2R1Y3RzICYmIHN0b2Nrcyl7XHJcbiAgICAgICAgY29uc3QgY29tYmluZWRQcm9kdWN0cyA9IHByb2R1Y3RzLm1hcChwcm9kdWN0ID0+IHtcclxuICAgICAgICBjb25zdCBzdG9jayA9IHN0b2Nrcy5maW5kKHN0b2NrID0+IHN0b2NrLnByb2R1Y3RfaWQgPT09IHByb2R1Y3QuaWQpO1xyXG4gICAgICAgIHJldHVybiB7IC4uLnByb2R1Y3QsIGNvdW50OiBzdG9jayA/IHN0b2NrLmNvdW50IDogMCB9O1xyXG4gICAgICB9KTtcclxuICAgIFxyXG4gIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHN0YXR1c0NvZGU6IDIwMCxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShjb21iaW5lZFByb2R1Y3RzKSxcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgICByZXR1cm4ge1xyXG4gICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcclxuICAgICAgICBib2R5OiAncHJvZHVjdHMgbm90IGZvdW5kJyxcclxuICAgICAgfTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHN0YXR1c0NvZGU6IDUwMCxcclxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogJ0ludGVybmFsIFNlcnZlciBFcnJvcicgfSksXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG59O1xyXG5cclxuXHJcbiJdfQ==