FROM node:10.15-alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
ENV NODE_ENV docker
RUN wget https://arkhn.org/pyrog_dev_static.zip
RUN unzip -o pyrog_dev_static.zip
RUN rm pyrog_dev_static.zip
CMD yarn run wait-on http://pyrog:4000 && PRISMA_ENDPOINT="http://prisma:4466" yarn run prisma deploy && PRISMA_ENDPOINT="http://prisma:4466" yarn run prisma import --data ./static/pyrog_mimic_mapping.zip && yarn run test --coverage
