FROM node:23.11.1

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app/

EXPOSE 5173

CMD ["npm", "run", "dev"]
