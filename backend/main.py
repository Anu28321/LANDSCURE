from fastapi import FastAPI

from api import router
from db import init_db


app = FastAPI(title="Land Property Backend")
app.include_router(router)


@app.on_event("startup")
def startup() -> None:
    init_db()
