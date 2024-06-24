"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = void 0;
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const productsTable = "products";
const stocksTable = "stocks";
const getProductById = async (event) => {
    try {
        const productId = event.pathParameters?.id;
        console.log('productId', productId);
        console.log('type of productId', (typeof productId));
        if (!productId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Product ID is required" }),
            };
        }
        const productResult = await dynamoDb
            .get({
            TableName: /*  process.env.PRODUCTS_TABLE || */ productsTable,
            Key: { id: productId },
        })
            .promise();
        console.log('productResult', productResult);
        if (!productResult.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Product not found" }),
            };
        }
        const stockResult = await dynamoDb
            .get({
            TableName: /* process.env.STOCKS_TABLE || */ stocksTable,
            Key: { product_id: productId },
        })
            .promise();
        console.log('stockResult', stockResult);
        const product = productResult.Item;
        const stock = stockResult.Item;
        console.log('product', stockResult);
        console.log('stock', stock);
        return {
            statusCode: 200,
            body: JSON.stringify({ ...product, count: stock ? stock.count : 0 }),
        };
    }
    catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `"something wrong " error ${err}`,
            }),
        };
    }
};
exports.getProductById = getProductById;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UHJvZHVjdEJ5SWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnZXRQcm9kdWN0QnlJZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSwrQkFBK0I7QUFFL0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBRW5ELE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQztBQUNqQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUM7QUFFdEIsTUFBTSxjQUFjLEdBQUcsS0FBSyxFQUNqQyxLQUEyQixFQUNLLEVBQUU7SUFDbEMsSUFBSSxDQUFDO1FBQ0QsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUM7UUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQztRQUV2RCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDZixPQUFPO2dCQUNMLFVBQVUsRUFBRSxHQUFHO2dCQUNmLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLENBQUM7YUFDNUQsQ0FBQztRQUNKLENBQUM7UUFFRCxNQUFNLGFBQWEsR0FBRyxNQUFNLFFBQVE7YUFDakMsR0FBRyxDQUFDO1lBQ0gsU0FBUyxFQUFDLG9DQUFvQyxDQUFDLGFBQWE7WUFDNUQsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRTtTQUN2QixDQUFDO2FBQ0QsT0FBTyxFQUFFLENBQUM7UUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUU5QyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3hCLE9BQU87Z0JBQ0wsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQzthQUN2RCxDQUFDO1FBQ0osQ0FBQztRQUNELE1BQU0sV0FBVyxHQUFHLE1BQU0sUUFBUTthQUMvQixHQUFHLENBQUM7WUFDSCxTQUFTLEVBQUUsaUNBQWlDLENBQUMsV0FBVztZQUN4RCxHQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFO1NBQy9CLENBQUM7YUFDRCxPQUFPLEVBQUUsQ0FBQztRQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRTFDLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7UUFDbkMsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQztRQUUvQixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUU1QixPQUFPO1lBQ0wsVUFBVSxFQUFFLEdBQUc7WUFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1NBQ3JFLENBQUM7SUFDSixDQUFDO0lBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsT0FBTztZQUNMLFVBQVUsRUFBRSxHQUFHO1lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ25CLE9BQU8sRUFBRSw0QkFBNEIsR0FBRyxFQUFFO2FBQzNDLENBQUM7U0FDSCxDQUFDO0lBQ0osQ0FBQztBQUNILENBQUMsQ0FBQztBQXhEVyxRQUFBLGNBQWMsa0JBd0R6QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFQSUdhdGV3YXlQcm94eUV2ZW50LCBBUElHYXRld2F5UHJveHlSZXN1bHQgfSBmcm9tIFwiYXdzLWxhbWJkYVwiO1xyXG5pbXBvcnQgeyBwcm9kdWN0cyB9IGZyb20gXCIuLi9tb2NrLWRhdGEvbW9jay1kYXRhXCI7XHJcbmltcG9ydCAqIGFzIEFXUyBmcm9tIFwiYXdzLXNka1wiO1xyXG5cclxuY29uc3QgZHluYW1vRGIgPSBuZXcgQVdTLkR5bmFtb0RCLkRvY3VtZW50Q2xpZW50KCk7XHJcblxyXG5jb25zdCBwcm9kdWN0c1RhYmxlID0gXCJwcm9kdWN0c1wiO1xyXG5jb25zdCBzdG9ja3NUYWJsZSA9IFwic3RvY2tzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0UHJvZHVjdEJ5SWQgPSBhc3luYyAoXHJcbiAgZXZlbnQ6IEFQSUdhdGV3YXlQcm94eUV2ZW50XHJcbik6IFByb21pc2U8QVBJR2F0ZXdheVByb3h5UmVzdWx0PiA9PiB7XHJcbiAgdHJ5IHtcclxuICAgICAgY29uc3QgcHJvZHVjdElkID0gZXZlbnQucGF0aFBhcmFtZXRlcnM/LmlkO1xyXG4gICAgICBjb25zb2xlLmxvZygncHJvZHVjdElkJywgcHJvZHVjdElkKTtcclxuICAgICAgY29uc29sZS5sb2coJ3R5cGUgb2YgcHJvZHVjdElkJywgKHR5cGVvZiBwcm9kdWN0SWQpKTtcclxuXHJcbiAgICBpZiAoIXByb2R1Y3RJZCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHN0YXR1c0NvZGU6IDQwMCxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6IFwiUHJvZHVjdCBJRCBpcyByZXF1aXJlZFwiIH0pLFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHByb2R1Y3RSZXN1bHQgPSBhd2FpdCBkeW5hbW9EYlxyXG4gICAgICAuZ2V0KHtcclxuICAgICAgICBUYWJsZU5hbWU6LyogIHByb2Nlc3MuZW52LlBST0RVQ1RTX1RBQkxFIHx8ICovIHByb2R1Y3RzVGFibGUsXHJcbiAgICAgICAgS2V5OiB7IGlkOiBwcm9kdWN0SWQgfSxcclxuICAgICAgfSlcclxuICAgICAgLnByb21pc2UoKTtcclxuICAgICAgY29uc29sZS5sb2coJ3Byb2R1Y3RSZXN1bHQnLCBwcm9kdWN0UmVzdWx0KTtcclxuXHJcbiAgICBpZiAoIXByb2R1Y3RSZXN1bHQuSXRlbSkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6IFwiUHJvZHVjdCBub3QgZm91bmRcIiB9KSxcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IHN0b2NrUmVzdWx0ID0gYXdhaXQgZHluYW1vRGJcclxuICAgICAgLmdldCh7XHJcbiAgICAgICAgVGFibGVOYW1lOiAvKiBwcm9jZXNzLmVudi5TVE9DS1NfVEFCTEUgfHwgKi8gc3RvY2tzVGFibGUsXHJcbiAgICAgICAgS2V5OiB7IHByb2R1Y3RfaWQ6IHByb2R1Y3RJZCB9LFxyXG4gICAgICB9KVxyXG4gICAgICAucHJvbWlzZSgpO1xyXG4gICAgICBjb25zb2xlLmxvZygnc3RvY2tSZXN1bHQnLCBzdG9ja1Jlc3VsdCk7XHJcblxyXG4gICAgY29uc3QgcHJvZHVjdCA9IHByb2R1Y3RSZXN1bHQuSXRlbTtcclxuICAgIGNvbnN0IHN0b2NrID0gc3RvY2tSZXN1bHQuSXRlbTtcclxuXHJcbiAgICBjb25zb2xlLmxvZygncHJvZHVjdCcsIHN0b2NrUmVzdWx0KTtcclxuICAgIGNvbnNvbGUubG9nKCdzdG9jaycsIHN0b2NrKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdGF0dXNDb2RlOiAyMDAsXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgLi4ucHJvZHVjdCwgY291bnQ6IHN0b2NrID8gc3RvY2suY291bnQgOiAwIH0pLFxyXG4gICAgfTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdGF0dXNDb2RlOiA1MDAsXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICBtZXNzYWdlOiBgXCJzb21ldGhpbmcgd3JvbmcgXCIgZXJyb3IgJHtlcnJ9YCxcclxuICAgICAgfSksXHJcbiAgICB9O1xyXG4gIH1cclxufTtcclxuIl19