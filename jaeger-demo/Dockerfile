# ! Important
# Since we rely in our code to environment variables for e.g. db connection
# this can only be run successfully with docker-compose file

# Specify node version and choose image
# also name our image as development (can be anything)
FROM node:14 AS development

# Specify our working directory, this is in our container/in our image
WORKDIR /thomas/src/app

# Copy the package.jsons from host to container
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Here we install all the deps
RUN npm install

# Bundle app source / copy all other files
COPY . .

# Build the app to the /dist folder
RUN npm run build

FROM node:18-alpine

WORKDIR /opt/app

COPY package*.json /opt/app/

RUN npm install

COPY . .

EXPOSE 3000