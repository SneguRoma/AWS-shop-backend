#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ProductsServiceStack } from '../lib/products_service-stack';

const app = new cdk.App();
new ProductsServiceStack(app, 'ProductsServiceStack');
