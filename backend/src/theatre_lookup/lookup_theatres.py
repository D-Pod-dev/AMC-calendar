import xml.etree.ElementTree as ET
from xml.dom import minidom

import requests

SITEMAP_THEATRES_XML = None

def print_xml(xml):
    if type(xml) == str:
        print(minidom.parseString(xml).toprettyxml(indent=" "*4))
    elif type(xml) == ET.Element:
        ET.dump(xml)
        # print(minidom.parseString(ET.tostring(xml, encoding="unicode")).toprettyxml(indent=" "*2))

def get_theatre_list():
    global SITEMAP_THEATRES_XML

    if SITEMAP_THEATRES_XML is None:
        SITEMAP_THEATRES_XML = ET.fromstring(requests.get("https://www.amctheatres.com/sitemaps/sitemap-theatres.xml").content)
        ET.indent(SITEMAP_THEATRES_XML, space=" "*2)

    print(SITEMAP_THEATRES_XML)
    return f"SITEMAP_THEATRES_XML type: {type(SITEMAP_THEATRES_XML)}"

# print_xml(get_theatre_list())