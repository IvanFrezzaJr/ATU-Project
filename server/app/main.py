from http import HTTPStatus

from fastapi import FastAPI


from app.routers import auth, users, items, trades
from app.schemas import (
    Message,
)
from app.middlewares.cors import setup_cors

from fastapi.staticfiles import StaticFiles


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
