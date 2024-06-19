import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { products } from './mock-data';




export const getProductById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const productId = event.pathParameters?.id;
        if (!productId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Product ID is required' }),
            };
        }

        const product = products.find((p) => p.id === productId);

        if (product) {
            return {
                statusCode: 200,
                body: JSON.stringify(product),
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify(products),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
