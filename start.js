'use strict';

const child_process = require('child_process');

const OPTIONS = {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit'
};

// start moutebank at localhost
const mb = child_process.spawn(
    './node_modules/.bin/mb',
    [ '--port', '1024' ,'--localOnly', '--nologfile' ],
    OPTIONS
);
mb.on('close', (code) => {
    console.error('mb exited with code', code);
    shutdown();
});

// start mock server
const apiMock = child_process.spawn(
    'node',
    [ 'api-mock.js' ],
    OPTIONS
);
apiMock.on('close', (code) => {
    console.error('apiMock exited with code', code);
    shutdown();
});

// start api server
const apiServer = child_process.spawn(
    'node',
    [ 'api-server.js' ],
    OPTIONS
);
apiServer.on('close', (code) => {
    console.error('apiServer exited with code', code);
    shutdown();
});

let shutdownTimeoutId;
function shutdown() {
    if (!shutdownTimeoutId) {
        shutdownTimeoutId = setTimeout(() => {
            mb.kill();
            apiMock.kill();
            apiServer.kill();
        }, 1000)
    }
}
