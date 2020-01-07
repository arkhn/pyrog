###############################################################################
# Step 1 : Builder image
#
FROM node:12.13 as builder

# Our docker ignore file is very aggressive. Files that are needed
# must be explicitly whitelisted. This is to keep the docker
# context as small as possible.

# Define working directory and copy source
WORKDIR /home/node/app

# POSTGRES_URL needs to be defined in the environment at build time for prisma.
ENV POSTGRES_URL=${POSTGRES_URL}

# Install dependencies
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json
COPY yarn.lock yarn.lock

RUN yarn --frozen-lockfile
RUN yarn cache clean --force

# Build the server
COPY prisma prisma
COPY src src
COPY scripts scripts

RUN yarn build
RUN rm -rf src/

# Start the app
EXPOSE 4000
CMD node ./scripts/wait_for_db.js && yarn prisma2 lift up && yarn start

# ----> TODO: prisma2 cannot run in alpine yet since it needs some glibc library (https://github.com/prisma/photonjs/issues/173)
# ###############################################################################
# Step 2 : Run image
#
FROM node:12.13-slim

WORKDIR /home/node/app

ENV POSTGRES_URL=${POSTGRES_URL}

# Install deps for production only
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY src/generated src/generated

RUN yarn --frozen-lockfile && \
    yarn cache clean --force

COPY prisma prisma
COPY scripts scripts
RUN yarn prisma2 generate

# Copy built source from the upper builder stage
COPY --from=builder /home/node/app/dist ./dist

# Start the app
EXPOSE 4000
CMD node ./scripts/wait_for_db.js && yarn prisma2 lift up && yarn start
