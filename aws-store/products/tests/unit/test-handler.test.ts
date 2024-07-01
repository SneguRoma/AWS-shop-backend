import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getProductsList } from '../../getProducts';
import { expect, describe, it } from '@jest/globals';
import { products } from '../../mock-data';
// @ts-ignore
import { getProductsById } from '../../../.aws-sam/build/GetProductsByIdFunction/getProduct';

describe('Unit test for getProductsList handler', function () {
    it('verifies successful response', async () => {
        const result: APIGatewayProxyResult = await getProductsList();
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(JSON.stringify(products));
    });
});

describe('Unit test for getProduct handler', function () {
    it('verifies successful response', async () => {
        const event: APIGatewayProxyEvent = {
            httpMethod: 'GET',
            body: null,
            headers: {},
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/products/7567ec4b-b10c-48c5-9345-fc73c48a80aa',
            pathParameters: {
                productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
            },
            queryStringParameters: {},
            requestContext: {
                requestId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
                accountId: '',
                apiId: '',
                authorizer: undefined,
                protocol: 'HTTP/1.1',
                httpMethod: 'GET',
                identity: {
                    accessKey: null,
                    accountId: null,
                    apiKey: null,
                    apiKeyId: null,
                    caller: null,
                    clientCert: null,
                    cognitoAuthenticationProvider: null,
                    cognitoAuthenticationType: null,
                    cognitoIdentityId: null,
                    cognitoIdentityPoolId: null,
                    principalOrgId: null,
                    sourceIp: '127.0.0.1',
                    user: null,
                    userAgent: 'jest',
                    userArn: null,
                },
                path: '',
                stage: '',
                requestTimeEpoch: 0,
                resourceId: '',
                resourcePath: '',
            },
            resource: '',
            stageVariables: {},
        };

        const result: APIGatewayProxyResult = await getProductsById(event);
        const productId = event.pathParameters?.productId;
        const product = products.find((p) => p.id === productId);

        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(JSON.stringify(product));
    });
});
