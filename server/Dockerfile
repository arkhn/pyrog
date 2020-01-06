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

#ENV NODE_ENV=production
ENV NODE_ENV docker
WORKDIR /home/node/app

# Install deps for production only
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY tsconfig.json tsconfig.json

RUN yarn install --frozen-lockfile && \
    yarn cache clean --force

# Copy built source from the upper builder stage
COPY --from=builder /home/node/app/dist ./dist
COPY scripts scripts
COPY prisma prisma

RUN wget https://arkhn.org/pyrog_dev_static.zip
RUN unzip -o pyrog_dev_static.zip
RUN rm pyrog_dev_static.zip

# Start the app
EXPOSE 4000
CMD node ./scripts/wait_for_db.js &&\
    PRISMA_ENDPOINT="http://prisma:4466" yarn run prisma reset --force &&\
    PRISMA_ENDPOINT="http://prisma:4466" yarn run prisma deploy &&\
    #not in image# PRISMA_ENDPOINT="http://prisma:4466" yarn run prisma import --data ./static/pyrog_mimic_mapping.zip &&\
    yarn start:docker
