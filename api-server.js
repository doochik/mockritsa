'use strict';

const PORT = process.env.PORT_API;
if (!PORT) {
    throw new Error('Failed to start API server! env.PORT_API is undefined!');
}

const http = require('http');
const proxy = require('./lib/proxy');

const server = http.createServer(onRequest);
server.listen(PORT);
server.on('listening', () => {
    console.log(`The API server is running at port ${ PORT }`);
});
server.on('close', () => {
    console.log('The API server is closed');
});
server.on('clientError', function(err, socket) {
    if (!socket.destroyed) {
        socket.end(`HTTP/1.1 400 ${ http.STATUS_CODES[400] }\r\n\r\n`);
    }
});

function onRequest(req, res) {
    if (req.url === '/ping') {
        // "/ping" response for external healthcheck tools
        res.end();
        return;
    }

    if (req.method === 'OPTIONS') {
        // Process preflight CORS request
        return processCorsOptionsRequest(req, res);
    }

    injectCORSHeaders(req, res);

    // proxy all requests to mountebank api server
    proxy(req, res, 1024);
}

function processCorsOptionsRequest(req, res) {
    injectCORSHeaders(req, res);
    res.statusCode = 200;
    res.end();
}

function injectCORSHeaders(req, res) {
    res.setHeader('access-control-allow-origin', '*');
    res.setHeader('access-control-allow-credentials', 'true');
    res.setHeader('access-control-allow-headers', 'content-type');
    res.setHeader('access-control-allow-methods', 'DELETE, POST, PUT, OPTIONS');
}
