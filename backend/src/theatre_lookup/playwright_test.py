import asyncio
import json

from playwright.async_api import async_playwright
from query_handler import TheatreLookupQueryHandler


async def get_browser_data():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)

        context = await browser.new_context()
        page = await context.new_page()
        
        page.on("request", lambda request: print(request.url+'\n'+json.dumps(request.headers)))

        await page.goto("https://amctheatres.com")

        #await page.wait_for_timeout(5000)

        cookies = await context.cookies()

        print("Cookies:\n", json.dumps(cookies))

        input("press enter to finish the program")

        """
        query_handler = TheatreLookupQueryHandler()
        query = query_handler.build_query()
        print(type(query)) # str

        data={
            "operationName": "TheatreSelectModalQuery",
            "query": query,
            "variables":{
                "query": input("Search query: "),
            },
        }

        print("-"*10+"\n")
        print(json.dumps(data, indent=4))
        print(query)

        input("press enter to continue")

        
        response = await context.request.post("https://graph.amctheatres.com", data=data)

        #print(await response.text())
        print(f"{response.status} {response.status_text}")
        """
        await browser.close()

asyncio.run(get_browser_data())