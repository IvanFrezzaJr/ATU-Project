FROM node:23.10.0

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app/

EXPOSE 5173

CMD ["npm", "run", "dev"]
