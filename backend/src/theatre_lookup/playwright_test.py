import asyncio

from playwright.async_api import async_playwright


async def get_cookies():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        context = await browser.new_context()
        page = await context.new_page()

        await page.goto("https://amctheatres.com")

        await page.wait_for_timeout(5000)

        cookies = await context.cookies()
        
        await browser.close()

        return cookies

asyncio.run(get_cookies())