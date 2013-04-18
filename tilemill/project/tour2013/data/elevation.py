# TODO: Retrieve elevation profiles using Geonames elevation API
# http://www.geonames.org/export/web-services.html

from fiona import collection

with collection("tracks.shp", "r") as input:
    for point in input:
        print point['geometry'] # point['id'] contains 
