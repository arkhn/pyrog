###############################################################################
# Step 1 : Builder image
#
FROM node:12.13-alpine

# Our docker ignore file is very aggressive. Files that are needed
# must be explicitly whitelisted. This is to keep the docker
# context as small as possible.

# Define working directory and copy source
WORKDIR /app

# Install dependencies
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY yarn.lock yarn.lock

RUN yarn --frozen-lockfile
RUN yarn cache clean --force

# Build the server
COPY public public
COPY src src

RUN yarn build

# Start the app
CMD yarn serve -l $PORT build
