![logo](./logo.jpg)

# mockritsa

[Docker image](https://hub.docker.com/r/doochik/mockritsa) for [moutebank](http://www.mbtest.org) mock server.

## Motivation and architecture

`mountbank` uses port for each imposter (mock).
This is the problem when you run it in the Docker.
At this point you should publish container ports to the host and have the range of free ports to bind.

This solution uses only 2 ports (api and mock).
* API port: exposes the same interface as [mbtest.org](http://www.mbtest.org)
* mock port: exposes proxy to all imposters by cookie `mockritsa_imposter=NNNN`

## Usage

Pass env variables to container and expose ports

`docker run -d -e PORT_API=1025 -e PORT_MOCK=1026 -p 1025:1025 -p 1026:1026 doochik/mockritsa`

Now you can view mountebank interface at `localhost:1025` and mock server at `localhost:1026`.

Example:
1. Create imposter `curl -X POST 'localhost:1025/imposters' --data @examples/imposter.json` (example imposter uses port 42000)
2. Test created imposter
```
$ curl -s 'localhost:1026/api/1.0/test/' --cookie 'mockritsa_imposter=42000'
{
    "result": "this is mock response",
    "status": "SUCCESS"
}
```
3. Any other request from example will response with 200 OK and empty body. This is default mountebank behaviour. 

## Development

1. Run `npm install`
2. Start dev server `npm run dev`
 
Default ports at development mode:
* mountebank - 1024
* api server - 1025 
* mock server - 1026

