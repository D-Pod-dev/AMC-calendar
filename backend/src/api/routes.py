from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from requests.exceptions import HTTPError

from ..theatre_lookup.query_handler import TheatreLookupQueryHandler

router = APIRouter()

@router.get("/api/theatre-lookup")
async def theatre_lookup(query:str):
    query_handler = TheatreLookupQueryHandler()

    try:
        return query_handler.send_query(search_query=query)
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