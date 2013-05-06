from math import radians, cos, sin, asin, sqrt
from fiona import collection
import json

# From http://stackoverflow.com/questions/4913349/haversine-formula-in-python-bearing-and-distance-between-two-gps-points

def haversine(c1, c2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    lon1 = c1[0]
    lat1 = c1[1]
    lon2 = c2[0]
    lat2 = c2[1]
    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    km = 6367 * c
    return km * 1000

for i in range(1, 22):
    stage = "%02d" % i;
    f = open('elevation/stage_%s_elevation.json' % i)
    el = json.load(f)
    f.close()
    with collection(stage + ".shp/tracks.shp", "r") as input:
        for track in input:
            j = 0
            previous = False
            distance = 0
            profile = []
            for c in track['geometry']['coordinates']:
                if previous:
                    distance = distance + haversine(c, previous)
                profile.append([el[j], int(round(distance))])
                j = j + 1
                previous = c
            filename = 'elevation/elevation_%s.json' % i
            json.dump(profile, open(filename, 'w'))
            print filename + " written"
            break
