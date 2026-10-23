import json
import textwrap

import requests


class TheaterLookupQueryHandler:
    def __init__(
        self,
        default_result_count: int = 10,
        location_fields: list[str] | None = None,
        theatre_fields: list[str] | None = None,
        attributes_count: int | None = None,
        attributes_fields: None | list[str] = None,
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
            if attributes_fields is None:
                attributes_fields = ["name", "id"]

            if attributes_count is None:
                attributes_count = 4

            self.attributes_count = attributes_count
            self.attributes_fields = attributes_fields

    def build_query(self) -> str:
        base_dedent_value = 4*3

        if "attributes" in self.theatre_fields:
            attributes_block = textwrap.indent(textwrap.dedent(f"""
                attributes(type: FILTERS, first: {self.attributes_count}) {{
                  edges {{
                    node {{
                      {('\n'+' '*(base_dedent_value+2+2+3*2)).join(self.attributes_fields)}
                    }}
                  }}
                }}"""
            ), " "*(base_dedent_value+2))

        return textwrap.dedent(f"""
            query TheaterLookupQuery($query: String!, $resultCount: Int = {self.default_result_count}) {{
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
                      p if p != "attributes" else attributes_block
                      for p in self.theatre_fields
                  ]
              )}
            }}""")

    def send_query(self, search_query: str, result_count: int | None = None):
        result = requests.post(
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
        )
        # print(json.dumps(result.json(), indent=2))
        result.raise_for_status()
        return result.json()