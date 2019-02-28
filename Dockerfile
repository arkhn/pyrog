FROM node:8
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
ENV NODE_ENV docker
CMD ["npm", "start"]