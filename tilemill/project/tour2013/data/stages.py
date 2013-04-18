# Extract stages from track_points.shp and convert them to json.
# http://www.geonames.org/export/web-services.html

from fiona import collection
import json

geojson = { "type": "FeatureCollection", "features": [] }

with collection("track_points.shp", "r") as input:
    for point in input:
        if point['properties']['type'] == 'start':
            geojson['features'].append({
                "type": "Feature",
                "geometry": point['geometry'],
                "properties": point['properties']
            })

json.dump(geojson, open('stages.json', 'w'))