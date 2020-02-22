FROM node:8-alpine

EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN mkdir /app
WORKDIR /app
ADD package.json /app/
ADD yarn.lock /app/

ADD . /app

CMD ["yarn", "docker:start"]
