from fastapi import APIRouter
from fastapi.responses import JSONResponse
from requests.exceptions import HTTPError

from ..theatre_lookup.query_handler import TheatreLookupQueryHandler

router = APIRouter()

@router.get("/api/theatre-lookup")
async def theatre_lookup(query:str):
    query_handler = TheatreLookupQueryHandler()

    try:
        result = query_handler.send_query(search_query=query)        
        return result
    except HTTPError as e:
        return JSONResponse(
            status_code=e.response.status_code,
            content={"detail": f"Theatre lookup failed: {e.response.text}"}
        )
    except Exception as e:  # noqa: BLE001
        return JSONResponse(
            status_code=500,
            content={"detail" :str(e)}
        )