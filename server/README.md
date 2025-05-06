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


## debug
### vscode
```bash
export BUILD_TARGET=debug
docker-compose up -d --build
```

launch.json
```json
{
    "version": "0.2.0",
    "configurations": [
      {
        "name": "Python: Remote Attach (FastAPI)",
        "type": "debugpy",
        "request": "attach",
        "connect": {
          "host": "localhost",
          "port": 5678
        },
        "pathMappings": [
          {
            "localRoot": "${workspaceFolder}/server",
            "remoteRoot": "/app"
          }
        ]
      }
    ]
  }
```