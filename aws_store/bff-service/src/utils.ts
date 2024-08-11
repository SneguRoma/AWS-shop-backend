import http, { RequestOptions, IncomingMessage } from 'http';
import https from 'https';

export const request = (options: RequestOptions, body?: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        const protocol = options.protocol === 'https:' ? https : http;
        const req = protocol.request(options, (res: IncomingMessage) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(data);
                } else {
                    reject(new Error(`Status Code: ${res.statusCode}, Message: ${data}`));
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (body) {
            req.write(body);
        }

        req.end();
    });
};
