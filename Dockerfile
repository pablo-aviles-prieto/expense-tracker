FROM node:18-alpine

RUN mkdir -p /home/app
WORKDIR /home/app

COPY package*.json .

ENV NODE_ENV=production

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]