from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.settings import Settings

settings = Settings()

def setup_cors(app: FastAPI) -> None:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # TODO: add allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"]
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
