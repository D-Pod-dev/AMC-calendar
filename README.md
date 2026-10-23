# AMC-calendar
A web scraper-based calendar for AMC Theatres' movie showtimes.

I'm not a huge fan of AMC Theatres' existing UI, which requires you to click through every single day to browse showtimes. Through web scraping, every page can be fetched in advance to create a structured calendar-like UI.

## Project Structure
```
AMC-calendar
|  backend
|  |  main.py
|  |  theater_lookup
|  |  |  query_builder.py  # Builds graphQL query for lookup
|  |  |  client.py         # Sends graphQL query
|  |  |  parser.py         # Parser theater data
|  |  showtimes_scraper
|  |  |  [TBD]             # lots of stuff goes here
|  |  api
|  |  |  routes.py         # frontend-backend connection
|  |  models
|  |  |  showtimes.py      # Pydantic models, if i need them
|  frontend
|  |  [TBD]       # we'll burn that bridge when we get there
```

## Toolset
### Python (Backend)
`poetry` used for package management.

#### Scraping Toolset:

 - **`requests`:** Downloads website pages.
    ```python
    import requests

    html = requests.get(url).text
    ```

 - **`BeautifulSoup`:** Parses HTML. (`lxml` is the html parser being used)
    ```python
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(html, "lxml")
    ```

#### For dynamic JS:
If the webpage's contents are loaded using js, not static html.
 - **`Playwright` (MODERN!):** loads web pages with JS.
 - **`Selenium`:** older browser automation, use only if Playwright fails.

#### Data handling:
 - **`re` (RegEx):** pattern extraction.
 - **`json`:** "save sample outputs and inspect them."
 - **`pprint`:** pretty-print nested dictionaries.

#### FastAPI:
Connecting python script to JS.
 - **`fastapi`:** exposes scraped data as an api endpoint.
 - **`uvicorn`:** "run the FastAPI server."
