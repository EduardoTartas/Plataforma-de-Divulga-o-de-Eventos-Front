FROM node:22-alpine

WORKDIR /front-app

COPY package.json package-lock.json ./

RUN npm ci --silent

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
