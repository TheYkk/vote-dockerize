FROM node:10-alpine
LABEL maintainer="Jason Greathouse <jgreat@jgreat.me>"

ADD ./package.json /app/package.json
WORKDIR /app
RUN npm install

# add app
ADD . /app



#Default command to run on start up
COPY wait-for-it.sh /app

CMD ["./wait-for-it.sh", "rabbitmq:5672", "-t", "120", "--", "node", "src/index.js"]
