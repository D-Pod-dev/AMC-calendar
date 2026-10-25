@echo off
poetry -C backend run uvicorn src.main:app --reload --reload-dir .. --reload-include "*.html" --reload-include "*.css" --reload-include "*.js"
