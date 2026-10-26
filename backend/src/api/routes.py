from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/api/theatre-lookup")
async def theatre_lookup(query:str):
    
    
    return JSONResponse(
        status_code=200,
        content={"message": query}
    )