'use strict';

const http = require('http');

module.exports = (originalReq, originalRes, port) => {
    const options = {
        hostname: 'localhost',
        port: port,
        path: originalReq.url,
        method: originalReq.method,
        headers: originalReq.headers,
    };

    const proxyReq = http.request(options, (res) => {
        originalRes.writeHead(res.statusCode, res.headers);
        res.pipe(originalRes, {
            end: true
        });
    });

    proxyReq.on('error', (err) => {
        originalRes.writeHead(502, {
            'content-type': 'application/json'
        });
        originalRes.end(JSON.stringify(err));
    });

    // Ensure we abort proxy if request is aborted
    originalReq.on('aborted', () => {
        proxyReq.abort();
    });

    originalReq.pipe(proxyReq, {
        end: true
    });
};
