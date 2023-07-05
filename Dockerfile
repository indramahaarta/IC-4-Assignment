FROM node:18.16-alpine 

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

EXPOSE 8001

CMD ["npm", "run", "start"]
