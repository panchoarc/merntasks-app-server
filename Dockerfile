ARG name=node:current-alpine3.13 

FROM ${name} as builder
WORKDIR  /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 4000
CMD [ "npm", "run", "dev" ]