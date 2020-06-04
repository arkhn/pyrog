# ----> TODO: prisma2 cannot run in alpine yet since it needs some glibc library (https://github.com/prisma/photonjs/issues/173)
# ###############################################################################
# Step 2 : Run image
#
FROM node:12.13-slim

WORKDIR /home/node/app

ENV POSTGRES_URL=${POSTGRES_URL}

# Install deps for production only
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json
COPY yarn.lock yarn.lock

RUN yarn --frozen-lockfile
RUN yarn cache clean --force

COPY prisma prisma
COPY src src

ARG JWT_PRIVATE_KEY
ENV JWT_PRIVATE_KEY $JWT_PRIVATE_KEY

RUN yarn prisma2 generate
RUN yarn build

COPY scripts scripts

# Start the app
ENV NODE_PATH dist/

CMD yarn wait:db && yarn migrate:up && yarn start
