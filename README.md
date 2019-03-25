# mockritsa

Docker image for [moutebank](http://www.mbtest.org) mock server.

## Motivation and architecture

`mountbank` uses port for each imposter (mock).
This is the problem when you run it in the Docker.
At this point you should publish container ports to the host and have the range of free ports to bind.

This solution uses only 2 ports (api and mock).
* API port: exposes the same interface as [mbtest.org](http://www.mbtest.org)
* mock port: exposes proxy to all imposters by cookie `mockritsa_imposter=NNNN`

## Usage

TODO

## Development

1. Run `npm install`
2. Start dev server `npm run dev`
 
Default ports at development mode:
* mountebank - 1024
* api server - 1025 
* mock server - 1026

