import xml.etree.ElementTree as ET
from xml.dom import minidom

import requests
from rapidfuzz import fuzz

SITEMAP_THEATRES_XML = None
theatres_list = None

def print_xml(xml):
    if type(xml) == str:
        print(minidom.parseString(xml).toprettyxml(indent=" "*4))
    elif type(xml) == ET.Element:
        ET.dump(xml)
        # print(minidom.parseString(ET.tostring(xml, encoding="unicode")).toprettyxml(indent=" "*2))

def fetch_theatre_list():
    global SITEMAP_THEATRES_XML, theatres_list
    
    SITEMAP_THEATRES_XML = ET.fromstring(requests.get("https://www.amctheatres.com/sitemaps/sitemap-theatres.xml").text)
    ET.indent(SITEMAP_THEATRES_XML, space=" "*2)

    for e in SITEMAP_THEATRES_XML.iter():
        if "{" in e.tag:
            e.tag = e.tag.split("}", 1)[1]

    theatres_list = [{"url": url[0].text, **{attr.get("name"): attr.text for attr in url.findall(".//Attribute")}} for url in SITEMAP_THEATRES_XML]


def lookup_theatres(query: str, search_by:str = "city", count: int = 10):
    global SITEMAP_THEATRES_XML, theatres_list

    # load theatres if not loaded yet
    if SITEMAP_THEATRES_XML is None:
        fetch_theatre_list()

    if search_by == "name":
        search_by = "title"
    
    matches = sorted(
        ({
            "ratio": fuzz.token_set_ratio(query.lower(),
            theatre[search_by].lower()), **theatre
        } for theatre in theatres_list),

        key=lambda theatre: theatre["ratio"],
            reverse=True)

    return matches[:count]

def get_theatre(theatre_id):
    for theatre in theatres_list:
        if theatre['theatreId'] == str(theatre_id):
            return theatre

    return None