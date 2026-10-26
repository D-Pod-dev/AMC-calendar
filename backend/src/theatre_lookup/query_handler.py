import asyncio
import json
import textwrap

import requests
from playwright.async_api import async_playwright


class TheatreLookupQueryHandler:
    def __init__(
        self,
        default_result_count: int = 10,
        location_fields: list[str] | None = None, # requested attributes of each returned location
        theatre_fields: list[str] | None = None, # requested attributes of each returned theatre
        theatre_attribute_count: int | None = None, # number of requested theatre attributes, requested as part of "attributes", if it's in theatre_fields
        #   attribute examples:
        #       Screen types - eg. "RealD 3D", "Laser at AMC",
        #       Amenities - eg. "AMC Signature Recliners", "Food & Drinks Mobile Ordering"
        #       Discounts - eg. "Discount Matinees", "Military Discount"
        #       Accessibility - eg. "Wheelchair Ramps", "Open Caption (On-Screen Subtitles)"
        theatre_attribute_fields: None | list[str] = None, # requested information about each theatre attribute
    ) -> None:
                
        if location_fields is None:
            location_fields = ["title", "latitude", "longitude"]

        if theatre_fields is None:
            theatre_fields = [
                "name",
                "theatreId",
                "slug",
                "marketSlug",
                "isSelected",
                "longName",
                "secondaryLongName",
                "addressLine1",
                "addressLine2",
                "city",
                "state",
                "stateCode",
                "postalCode",
                "latitude",
                "longitude",
                "distance",
                "brand",
                "attributes",
            ]

        self.default_result_count = default_result_count
        self.location_fields = location_fields
        self.theatre_fields = theatre_fields

        if "attributes" in self.theatre_fields:
            if theatre_attribute_fields is None:
                theatre_attribute_fields = ["name", "id"]

            if theatre_attribute_count is None:
                theatre_attribute_count = 4

            self.theatre_attribute_count = theatre_attribute_count
            self.theatre_attribute_fields = theatre_attribute_fields

    def build_query(self) -> str:
        base_dedent_value = 4*3 # indentation of this code block to account for when constructing query

        if "attributes" in self.theatre_fields:
            theatre_attribute_block = textwrap.indent(textwrap.dedent(f"""
                attributes(type: FILTERS, first: {self.theatre_attribute_count}) {{
                  edges {{
                    node {{
                      {('\n'+' '*(base_dedent_value+2+2+3*2)).join(self.theatre_attribute_fields)}
                    }}
                  }}
                }}"""
            ), " "*(base_dedent_value+2))

        return textwrap.dedent(f"""
            query theatreLookupQuery($query: String!, $resultCount: Int = {self.default_result_count}) {{
              viewer {{
                location(query: $query, first: $resultCount) {{
                  edges {{
                    node {{
                      ...TheatreSelectResult
                    }}
                  }}
                }}
              }}
            }}

            fragment TheatreSelectResult on Location {{
              {("\n"+" "*(base_dedent_value+2)).join(self.location_fields)}
              theatres {{
                edges {{
                  node {{
                    ...TheatreSelectTheatre
                  }}
                }}
              }}
            }}

            fragment TheatreSelectTheatre on Theatre {{
              {("\n"+" "*(base_dedent_value+2)).join(
                  [
                      p if p != "attributes" else theatre_attribute_block
                      for p in self.theatre_fields
                  ]
              )}
            }}""")

    async def get_cookies(self):
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)

            context = await browser.new_context()
            page = await context.new_page()

            await page.goto("https://amctheatres.com")

            await page.wait_for_timeout(5000)

            cookies = await context.cookies()
            
            await browser.close()

            return cookies

    def send_query(self, search_query: str, result_count: int | None = None):
        session = requests.Session()
        session.get("https://amctheatres.com")

        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/141.0.0.0 Safari/537.36"
            ),
            "Accept": "*/*",
            "Content-Type": "application/json",
            "Origin": "https://www.amctheatres.com",
            "Referer": "https://www.amctheatres.com/",
        }

        # playwright_cookies = await asyncio.run(self.get_cookies())

        # for cookie in playwright_cookies:
        #     session.cookies.set(
        #         cookie["name"],
        #         cookie["value"],
        #         domain=cookie.get("domain"),
        #         path=cookie.get("path", "/")
        #     )

        result = session.post(
            "https://graph.amctheatres.com/",
            json={
                "query": self.build_query(),
                "variables": json.dumps(
                    {
                        "query": search_query,
                        "resultCount": result_count or self.default_result_count,
                    }
                ),
            },
            headers=headers
        )
        
        # print(json.dumps(result.json(), indent=2))
        result.raise_for_status()
        return result.json()