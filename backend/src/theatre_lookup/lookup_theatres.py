import xml.etree.ElementTree as ET
from xml.dom import minidom

import requests
from rapidfuzz import fuzz

SITEMAP_THEATRES_XML = None
theatres_dict = None

def print_xml(xml):
    if type(xml) == str:
        print(minidom.parseString(xml).toprettyxml(indent=" "*4))
    elif type(xml) == ET.Element:
        ET.dump(xml)
        # print(minidom.parseString(ET.tostring(xml, encoding="unicode")).toprettyxml(indent=" "*2))

def lookup_theatres(query: str, search_by:str = "city", count: int = 10):
    global SITEMAP_THEATRES_XML, theatres_dict

    # load theatres if not loaded yet
    if SITEMAP_THEATRES_XML is None:
        SITEMAP_THEATRES_XML = ET.fromstring(requests.get("https://www.amctheatres.com/sitemaps/sitemap-theatres.xml").text)
        ET.indent(SITEMAP_THEATRES_XML, space=" "*2)

        for e in SITEMAP_THEATRES_XML.iter():
            if "{" in e.tag:
                e.tag = e.tag.split("}", 1)[1]

        theatres_dict = [{"url": url[0].text, **{attr.get("name"): attr.text for attr in url.findall(".//Attribute")}} for url in SITEMAP_THEATRES_XML]

    matches = sorted(
        ({
            "ratio": fuzz.token_set_ratio(query.lower(),
            theatre[search_by].lower()), **theatre
        } for theatre in theatres_dict),
        
        key=lambda theatre: theatre["ratio"],
            reverse=True)

    return matches[:count]

# print_xml(get_theatre_list())