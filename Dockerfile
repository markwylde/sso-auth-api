FROM node:10-alpine

RUN mkdir /app
WORKDIR /app

RUN apk update && apk add git bash

ADD package.json package.json
RUN npm install

ADD . .

ENTRYPOINT ["/app/bin/entrypoint.sh"]
