'use strict';

const PORT = process.env.PORT_MOCK;
if (!PORT) {
    throw new Error('Failed to start MOCK server! env.PORT_MOCK is undefined!');
}

const http = require('http');
const proxy = require('./lib/proxy');

const server = http.createServer(onRequest);
server.listen(PORT);
server.on('listening', () => {
    console.log(`The MOCK server is running at port ${ PORT }`);
});
server.on('close', () => {
    console.log('The MOCK server is closed');
});
server.on('clientError', function(err, socket) {
    if (!socket.destroyed) {
        socket.end(`HTTP/1.1 400 ${ http.STATUS_CODES[400] }\r\n\r\n`);
    }
});

const MOCKRITSA_IMPOSTER_PORT_RE = /mockritsa_imposter=(\d+)/;

function onRequest(req, res) {
    if (req.url === '/ping') {
        // "/ping" response for external healthcheck tools
        res.end();
        return;
    }

    const cookieHeader = req.headers.cookie || '';
    const importerPort = cookieHeader.match(MOCKRITSA_IMPOSTER_PORT_RE);
    if (importerPort && importerPort[1]) {
        // proxy request to specified mountebank port
        proxy(req, res, importerPort[1]);
    } else {
        res.writeHead(400, {
            'content-type': 'application/json'
        });
        res.end(JSON.stringify({
            code: 'MOCKRITSA.INVALID_IMPOSTER_PORT',
            message: 'Can\'t find valid "mockritsa_imposter" cookie'
        }));
    }
}
