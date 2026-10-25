from fastapi import APIRouter

router = APIRouter()

@router.get("/api/test")
async def test(query:str):
    return {"message": f"API works! Query: {query}"}