FROM node:12-alpine
WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json ./
RUN yarn install

COPY src src
COPY public public
RUN yarn build

EXPOSE 1729
ENV NODE_ENV docker
ENV PORT 1729

CMD ["yarn", "serve", "-s", "build"]