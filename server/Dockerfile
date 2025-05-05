# --- BASE STAGE ---
FROM python:3.13-slim AS base

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


# --- PRODUCTION STAGE (default) ---
FROM base AS prod

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "app.main:api", "--reload", "--host", "0.0.0.0", "--port", "8000"]


# --- DEBUG STAGE ---
FROM base AS debug

# debugpy Install
RUN poetry add debugpy

EXPOSE 8000

# debug port
EXPOSE 5678

CMD ["sh", "-c", "poetry run python -m debugpy --listen 0.0.0.0:5678 --wait-for-client -m uvicorn app.main:api --reload --host 0.0.0.0 --port 8000"]
