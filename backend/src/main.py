import os
from pathlib import Path

from fastapi import FastAPI

from .api.routes import router

app = FastAPI()

# deployment debugging
print("\n".join(
    [f"cwd: {os.getcwd()}",
     f"__file__: {__file__}",
     f"frontend exists: {Path('../frontend').exists()}",
     f"resolved: {Path('../frontend').resolve()}"]
))

app.include_router(router)
app.frontend("/", directory="../frontend")