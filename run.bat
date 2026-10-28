@echo off
poetry run uvicorn backend.src.main:app --reload --reload-dir .. --reload-include "*.html" --reload-include "*.css" --reload-include "*.js"
