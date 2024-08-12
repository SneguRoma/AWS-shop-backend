import http from "http";
import https from "https";
import { URL } from "url";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3001;
const SERVICES: { [key: string]: string | undefined } = {
  product: process.env.PRODUCT_SERVICE_URL,
  cart: process.env.CART_SERVICE_URL,
};

const server = http.createServer((req, res) => {
  if (req.url === "/favicon.ico") {
    res.writeHead(204); // No Content
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url || "", `http://${req.headers.host}`);
  const pathSegments = parsedUrl.pathname?.split("/").filter(Boolean) || [];

  if (pathSegments.length < 1) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid request" }));
    return;
  }

  const serviceName = pathSegments[0];
  const serviceUrl = SERVICES[serviceName];

  if (!serviceUrl) {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Cannot process request" }));
    return;
  }

  const targetUrl = new URL(serviceUrl);

  if (targetUrl.pathname !== "/" && targetUrl.pathname.endsWith("/")) {
    targetUrl.pathname = "";
  }
  if (pathSegments.length > 1) {
    if (!targetUrl.pathname.endsWith("/")) targetUrl.pathname += "/";
    targetUrl.pathname += pathSegments.slice(1).join("/");
  }

  targetUrl.search = parsedUrl.search || "";

  const options = {
    method: req.method,
    headers: {
      ...req.headers,
      host: targetUrl.host,
    },
  };

  const protocol = targetUrl.protocol === "https:" ? https : http;

  const proxyReq = protocol.request(targetUrl, options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
    proxyRes.pipe(res);
  });

  req.pipe(proxyReq);

  proxyReq.on("error", (error) => {
    console.error("Request error:", error);
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Cannot process request" }));
  });
});

server.listen(PORT, () => {
  console.log(`BFF Service is running on port ${PORT}`);
});
