FROM node:latest

RUN npm install -g sails grunt npm-check-updates


RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm install

COPY ~/.aws/credentials ~/.aws/credentials

COPY . /app

EXPOSE 1337

CMD ["node", "app.js"]
