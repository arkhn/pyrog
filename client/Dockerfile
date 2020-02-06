FROM node:12-alpine
WORKDIR /app

ARG ENV_FILE=.env

COPY package.json yarn.lock tsconfig.json ./
RUN yarn --frozen-lockfile
RUN yarn cache clean --force

COPY src src
COPY public public
COPY $ENV_FILE .env

ENV NODE_ENV production
RUN yarn build

CMD yarn serve -s build