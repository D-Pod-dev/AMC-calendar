# AMC-calendar
A web scraper-based calendar for AMC Theatres' movie showtimes.

I'm not a huge fan of AMC Theatres' existing UI, which requires you to click through every single day to browse showtimes. Through web scraping, every page can be fetched in advance to create a structured calendar-like UI.

## Running the app
### Requirements
#### Python (version 3.13 or newer)
Download python at https://www.python.org/downloads/ and enable `Add python.exe to PATH` when installing

Make sure to confirm installation with:
```powershell
python --version
```
#### Poetry (python package manager)
Go to https://python-poetry.org/docs/#installation/ and follow installation instructions.

Make sure to confirm installation with:
```powershell
poetry --version
```
### Clone repository
```
git clone https://github.com/D-Pod-dev/AMC-calendar.git
```
### Install dependencies & run program
Move into **the backend folder.**
```
cd AMC-calendar/backend
```
**This is important!** If you move into the root, you will not be able to run the local server.

Once in the backend directory, run this to install dependencies:
```
poetry install
```

Once the installation is completed, run the program using:
```
poetry run uvicorn src.main:app --reload
```

### `run.bat`
This file lets you run the app from the root directory without having to cd into `/backend`, given that you already have all the prerequisites installed.

Then open http://127.0.0.1:8000/ in your browser to see the webpage, or http://127.0.0.1:8000/docs for api documentation.


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
|  |  index.html           # main page for now (idk if i'll even need more tbh)
|  |  style.css            # page look pretty 🥰
|  |  js                   # JavaSlop goes here /j kidding love you js
|  |  |  main.js           # main logic, connects page to api
|  |  |  api.js            # connects frontend to backend
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
 - **`fastapi`:** exposes scraped data as an api endpoint. ✅
 - **`uvicorn`:** runs the FastAPI server.
