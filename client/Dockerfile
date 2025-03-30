# Usando a imagem base do Node.js
FROM node:23.10.0

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos do frontend para o contêiner
COPY package*.json /app/

# Instale as dependências (de produção e desenvolvimento)
RUN npm install

# Copie o restante dos arquivos do projeto
COPY . /app/

# Caso o projeto precise ser compilado, adicione o comando de build
# RUN npm run build   # Descomente essa linha se precisar construir o projeto antes de rodá-lo

# Exponha a porta onde o Vite servirá o frontend (porta padrão do Vite)
EXPOSE 5173

# Comando para iniciar o Vite em modo de desenvolvimento
CMD ["npm", "run", "dev"]
