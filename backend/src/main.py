from pathlib import Path

from fastapi import FastAPI

from .api.routes import router

app = FastAPI()

# deployment debugging
frontend_dir = Path(__file__).parents[2] / "frontend"

app.include_router(router)
app.frontend("/", directory=frontend_dir)