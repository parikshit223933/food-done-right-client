FROM node:16-alpine

RUN apk update

RUN mkdir /food-done-right-client
WORKDIR /food-done-right-client

COPY . .
RUN npm install
