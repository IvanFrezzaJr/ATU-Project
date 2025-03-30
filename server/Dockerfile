# Usando uma imagem base do Python 3.13 ou superior
FROM python:3.13-slim

# Instalar dependências do sistema necessárias para o Poetry e o projeto
RUN apt-get update && apt-get install -y \
    curl \
    && curl -sSL https://install.python-poetry.org | python3 - \
    && apt-get clean

# Adicionar o Poetry ao PATH
ENV PATH="/root/.local/bin:$PATH"

# Configurar o Poetry para usar um ambiente virtual dentro do projeto
RUN poetry config virtualenvs.in-project false

# Defina o diretório de trabalho
WORKDIR /app

# Copiar o arquivo `pyproject.toml` e `poetry.lock` para o container
COPY pyproject.toml poetry.lock /app/

# Instalar as dependências com o Poetry
RUN poetry install --no-root

# Copiar o código da aplicação
COPY . /app/

# Expor a porta que o FastAPI usará
EXPOSE 8000

# Comando para rodar a aplicação FastAPI com Uvicorn
CMD ["poetry", "run", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]

