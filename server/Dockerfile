FROM node:10.15-alpine
WORKDIR $WORKDIR
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .
EXPOSE $SERVER_PORT
ENV NODE_ENV docker
CMD ["yarn", "start"]
