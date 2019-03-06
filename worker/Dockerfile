FROM node:10-alpine

LABEL maintainer="Yusuf Kaan Karakaya <yusufkaan142@gmail.com>"


ADD ./package.json /app/package.json
WORKDIR /app
RUN npm install

# add app
ADD . /app

CMD node src/index.js
