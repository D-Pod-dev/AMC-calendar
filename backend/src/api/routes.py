from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from requests.exceptions import HTTPError

from ..theatre_lookup.lookup_theatres import *

router = APIRouter()

@router.get("/api/theatre-lookup")
async def theatre_lookup(query:str):
    try:
        return get_theatre_list()
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