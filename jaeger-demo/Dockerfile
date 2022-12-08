FROM node:18-alpine

WORKDIR /opt/app

COPY package*.json /opt/app/

RUN npm i -g @nestjs/cli rimraf
RUN npm install 

COPY . .

EXPOSE 3000

CMD [ "node", "dist/main.js"]