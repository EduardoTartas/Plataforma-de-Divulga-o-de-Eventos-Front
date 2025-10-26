FROM node:22-alpine

WORKDIR /front-app

COPY package.json package-lock.json ./

RUN npm ci --silent

COPY . .

CMD ["npm", "run", "dev"]
