import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';


import { Construct } from 'constructs';
import { products } from '../lambda/mock-data';

export class ProductsServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    console.log('Creating Lambda function for Get-Products-List-Lambda');

    const getProductListLambda = new lambda.Function(this, 'Get-Products-List-Lambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getProducts.getProductsList',
      environment: {
        PRODUCTS: JSON.stringify(products),
      },

    })

    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: getProductListLambda
    });

    
  }
}
