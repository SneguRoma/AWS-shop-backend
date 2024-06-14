import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} _event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
    try {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-origin': 'http://localhost:3000/',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PATCH',
            },
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

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
}

export const products: Product[] = [
    {
        description: 'Short Product Description1',
        id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
        price: 24,
        title: 'ProductOne',
    },
    {
        description: 'Short Product Description7',
        id: '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
        price: 15,
        title: 'ProductTitle',
    },
    {
        description: 'Short Product Description2',
        id: '7567ec4b-b10c-48c5-9345-fc73c48a80a3',
        price: 23,
        title: 'Product',
    },
    {
        description: 'Short Product Description4',
        id: '7567ec4b-b10c-48c5-9345-fc73348a80a1',
        price: 15,
        title: 'ProductTest',
    },
    {
        description: 'Short Product Descriptio1',
        id: '7567ec4b-b10c-48c5-9445-fc73c48a80a2',
        price: 23,
        title: 'Product2',
    },
    {
        description: 'Short Product Description7',
        id: '7567ec4b-b10c-45c5-9345-fc73c48a80a1',
        price: 15,
        title: 'ProductName',
    },
];
