FROM node:13-alpine

RUN apk update && apk add openssl-dev libssl1.1 wget unzip git

WORKDIR /home/node/app

ENV POSTGRES_URL=postgresql://required:by@prisma/generate
ENV JWT_PRIVATE_KEY=requiredToBuildTheApp

# Install deps for production only
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json
COPY yarn.lock yarn.lock

RUN yarn --frozen-lockfile
RUN yarn cache clean --force

COPY prisma prisma
COPY src src

RUN yarn build

COPY scripts scripts

# Start the app
ENV NODE_PATH dist/

CMD yarn wait:db && yarn migrate:up && yarn start
