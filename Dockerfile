FROM node:16-alpine

RUN mkdir /app
WORKDIR /app

RUN apk update && apk add git bash

ADD package.json package.json
RUN npm install

ADD . .

CMD ["/app/bin/entrypoint.sh"]
