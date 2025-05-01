# ATU-Project

## setup (no docker)
```bash
poetry install
```

```bash
poetry run pre-commit install
```


## migration

init migrations

```bash
alembic init migrations
```

generate migration
```bash
alembic revision --autogenerate -m "create users table"
```

apply migration
```bash
alembic upgrade head
```