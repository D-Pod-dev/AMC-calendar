from xml.dom import minidom
import xml.etree.ElementTree as ET

import requests

SITEMAP_THEATRES_XML = None

def print_xml(xml):
    print(minidom.parseString(xml).toprettyxml(indent=" "*4))

def get_theatre_list():
    if SITEMAP_THEATRES_XML is None:
        SITEMAP_THEATRES_XML = ET.fromstring(requests.get("https://www.amctheatres.com/sitemaps/sitemap-theatres.xml").text)
    
    return None

# print_xml(get_theatre_list())