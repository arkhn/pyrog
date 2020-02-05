FROM node:12-alpine
WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json ./
RUN yarn install

COPY src src
COPY public public
COPY .env.staging .env.staging

ENV NODE_ENV production

RUN yarn build:staging

CMD yarn serve -s build