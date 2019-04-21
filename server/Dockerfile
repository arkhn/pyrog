FROM node:10.15-alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 4000
ENV NODE_ENV docker
CMD ["yarn", "start"]
