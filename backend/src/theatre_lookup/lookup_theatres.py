import xml.etree.ElementTree as ET
from xml.dom import minidom

import requests

SITEMAP_THEATRES_XML = None
theatres_dict = None

def print_xml(xml):
    if type(xml) == str:
        print(minidom.parseString(xml).toprettyxml(indent=" "*4))
    elif type(xml) == ET.Element:
        ET.dump(xml)
        # print(minidom.parseString(ET.tostring(xml, encoding="unicode")).toprettyxml(indent=" "*2))

def get_theatres():
    global SITEMAP_THEATRES_XML, theatres_dict

    if SITEMAP_THEATRES_XML is None:
        SITEMAP_THEATRES_XML = ET.fromstring(requests.get("https://www.amctheatres.com/sitemaps/sitemap-theatres.xml").text)
        ET.indent(SITEMAP_THEATRES_XML, space=" "*2)

        for e in SITEMAP_THEATRES_XML.iter():
            if "{" in e.tag:
                e.tag = e.tag.split("}", 1)[1]

        theatres_dict = [{"url": url[0].text, **{attr.get("name"): attr.text for attr in url.findall(".//Attribute")}} for url in SITEMAP_THEATRES_XML]

    return theatres_dict

# print_xml(get_theatre_list())