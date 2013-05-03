# Convert all tracks to geojson.

from fiona import collection
import json

for i in range(1, 22):
    stage = "%02d" % i;
    with collection(stage + ".shp/tracks.shp", "r") as input:
        geojson = { "type": "FeatureCollection", "features": [] }
        for track in input:
            geojson['features'].append({
                "type": "Feature",
                "geometry": track['geometry'],
                "properties": track['properties']
            })
        json.dump(geojson, open('tracks/track-%s.json' % stage, 'w'))
