# Usando a imagem base do Node.js
FROM node:23.10.0

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos do frontend para o contêiner
COPY package*.json /app/

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos
COPY . /app/

# Exponha a porta onde o Vite servirá o frontend
EXPOSE 3000

# Comando para iniciar o Vite
CMD ["npm", "run", "dev"]
