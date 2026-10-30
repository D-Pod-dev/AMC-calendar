from xml.dom import minidom

import requests

def print_xml(xml):
    print(minidom.parseString(xml).toprettyxml(indent=" "*4))

def get_theatre_list():
    response = requests.get("https://www.amctheatres.com/sitemaps/sitemap-theatres.xml")
    
    return response.text

print_xml(get_theatre_list())