FROM node:10-alpine

ADD ./package.json /app/package.json

WORKDIR /app

RUN npm install

# add app
ADD . /app


CMD node src/index.js