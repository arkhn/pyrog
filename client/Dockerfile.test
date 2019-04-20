FROM node:10.15-alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
CMD yarn run test --coverage
