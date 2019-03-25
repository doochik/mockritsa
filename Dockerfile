FROM node:10
MAINTAINER Aleksei Androsov <doochik@ya.ru>

WORKDIR /opt/mockritsa/
COPY *.js *.json /opt/mockritsa/
COPY lib /opt/mockritsa/lib

RUN npm ci --production

CMD [ "node", "/opt/mockritsa/start.js" ]
