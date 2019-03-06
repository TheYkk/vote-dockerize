FROM node:10-alpine


ADD ./package.json /app/package.json
WORKDIR /app
RUN npm install

# add app
ADD . /app

#add entrypoint and start up scripts


#entrypoint script to set env vars when linking containers for dev


#Default command to run on start up
CMD node src/index.js
