FROM python:3.13-slim

RUN apt-get update && apt-get install -y \
    curl \
    gcc \
    libpq-dev \
    && curl -sSL https://install.python-poetry.org | python3 - \
    && apt-get clean

ENV PATH="/root/.local/bin:$PATH"

RUN poetry config virtualenvs.in-project false

WORKDIR /app

COPY pyproject.toml poetry.lock /app/

RUN poetry install --no-root

COPY . /app/

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "app.main:api", "--reload", "--host", "0.0.0.0", "--port", "8000"]
