FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod #para que instale solo las dependencias y no las devdepencies
COPY . .

CMD ["npm","start"]
