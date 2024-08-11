import http, { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { request } from './utils';
import dotenv from 'dotenv';

dotenv.config();

const serviceUrls: { [key: string]: string } = {
    product: process.env.PRODUCT_SERVICE_URL || "https://ads3jrnqm8.execute-api.eu-west-1.amazonaws.com/prod/products",
    cart: process.env.CART_SERVICE_URL || "   "
};

const requestHandler = async (req: IncomingMessage, res: ServerResponse) => {
    if (req.url === '/favicon.ico') {
        res.writeHead(204); // No Content
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url || '', `http://${req.headers.host}`);
    const serviceName = parsedUrl.pathname.split('/')[1];
    const serviceUrl = serviceUrls[serviceName || ''];

    console.log("parsedUrl", parsedUrl);
    console.log("serviceName", serviceName);
    console.log("serviceUrl", serviceUrl);

    if (!serviceUrl) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Cannot process request' }));
        return;
    }

    const serviceParsedUrl = new URL(serviceUrl + parsedUrl.pathname + parsedUrl.search);
    const options = {
        protocol: serviceParsedUrl.protocol,
        hostname: serviceParsedUrl.hostname,
        port: serviceParsedUrl.port,
        path: serviceParsedUrl.pathname + serviceParsedUrl.search,
        method: req.method,
        headers: req.headers as http.OutgoingHttpHeaders
    };

    try {
        const data = await request(options, req.method === 'POST' || req.method === 'PUT' ? req : undefined);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
    } catch (err) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error processing request' }));
    }
};

const server = http.createServer(requestHandler);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`BFF service listening at ${PORT} port`);
});
