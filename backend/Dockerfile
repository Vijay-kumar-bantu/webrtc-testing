FROM node:18-alpine

WORKDIR /backend

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm","start"]