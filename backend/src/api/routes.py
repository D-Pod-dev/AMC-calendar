from fastapi import APIRouter

router = APIRouter()

@router.get("/api")
async def test():
    pass