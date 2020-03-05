FROM node:12-alpine
WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./
RUN yarn --frozen-lockfile
RUN yarn cache clean --force

COPY src src
COPY public public

ARG ENV_FILE=.env
COPY $ENV_FILE .env

ENV NODE_ENV production
RUN yarn build

CMD yarn serve -s build