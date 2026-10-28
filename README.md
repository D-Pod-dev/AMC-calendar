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

### Install dependencies
Run this to install dependencies:
```
poetry install
```

### Quick run
Premade scripts in the project root contain the command to the program (described in next section).

#### Windows - `run.bat`
Just running the file will launch the app. Run the script in Command Prompt or PowerShell with the following command:
```cmd
run.bat
```

#### Unix-based systems (MacOS, Linux) - `run.sh`
This is a bit more complicated. First you need to **allow** the batch file to run:
```bash
chmod +x run.sh
```
Once you've done that, you can just run the file with the following command:
```bash
./run.sh
```

### Manually run program
Once the installation is completed, you can run the program using this command:
```
poetry run uvicorn backend.src.main:app --reload --reload-dir . --reload-include "*.html" --reload-include "*.js" --reload-include "*.css"
```
Long options (`--reload`, `--reload-dir`, `--reload-include`) are there so the app automatically updates when files are updated.

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
|  |  index.html           # main page for now
|  |  style.css            # page look pretty 🥰
|  |  main.js              # main logic, connects page to api

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
