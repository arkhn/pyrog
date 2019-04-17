FROM node:10.15-alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 4000
ENV NODE_ENV docker
RUN wget https://arkhn.org/pyrog_dev_static.zip
RUN unzip -o pyrog_dev_static.zip
RUN rm pyrog_dev_static.zip
RUN yarn run prisma import --data ./static/pyrog_mimic_mapping.zip
CMD ["yarn", "start"]
