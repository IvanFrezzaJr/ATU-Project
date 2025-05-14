from http import HTTPStatus

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.middlewares.cors import setup_cors
from app.routers import auth, items, trades, users
from app.schemas import (
    Message,
)

api = FastAPI()

setup_cors(api)

api.include_router(users.router)
api.include_router(items.router)
api.include_router(trades.router)
api.include_router(auth.router)

api.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@api.get('/', status_code=HTTPStatus.OK, response_model=Message)
def read_root():
    return {'message': 'hello world'}
