from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from requests.exceptions import HTTPError

from ..theatre_lookup.lookup_theatres import *

router = APIRouter()

@router.get("/api/theatre-lookup")
async def theatre_lookup(query:str, searchBy:str, resultCount:int = 10):
    try:
        if not isinstance(resultCount, int):
            resultCount = 10
        return lookup_theatres(query, searchBy, resultCount)
    except HTTPError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=str(e)
        )
    except Exception as e:  # noqa: BLE001
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )