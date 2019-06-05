FROM node:9

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
RUN npm i
COPY . /app

CMD npm run start