###############################################################################
# Step 1 : Builder image
#
FROM node:12.11-alpine AS builder

# Our docker ignore file is very aggressive. Files that are needed
# must be explicitly whitelisted. This is to keep the docker
# context as small as possible.

# Define working directory and copy source
WORKDIR /home/node/app

# Install dependencies
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY yarn.lock yarn.lock
RUN yarn --frozen-lockfile

# Build the server
COPY src src
RUN yarn build

###############################################################################
# Step 2 : Run image
#
FROM node:12.11-alpine

ENV NODE_ENV=production
WORKDIR /home/node/app

# Install deps for production only
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY tsconfig.json tsconfig.json

RUN yarn --frozen-lockfile && \
    yarn cache clean --force

# Copy built source from the upper builder stage
COPY --from=builder /home/node/app/dist ./dist

# Start the app
EXPOSE 4000
CMD yarn start:docker
