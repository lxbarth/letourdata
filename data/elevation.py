# TODO: Retrieve elevation profiles using Geonames elevation API
# http://www.geonames.org/export/web-services.html

from fiona import collection
import httplib
import json
import sys
from math import radians, cos, sin, asin, sqrt

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

for i in range(1,2):
    stage = "%02d" % i;
    print "Retrieving elevation data for " + stage + ".shp/tracks.shp"
    with collection(stage + ".shp/tracks.shp", "r") as input:
        for track in input:
            profile = []
            previous = False
            distance = 0
            for c in track['geometry']['coordinates']:
                retries = 0
                while True:
                    try:
                        # Retrieve elevation from Geonames
                        conn = httplib.HTTPConnection("api.geonames.org")
                        conn.request('GET', "/srtm3?lat=" + `c[1]` + "&lng=" + `c[0]` + "&username=lxbarth")
                        response = conn.getresponse()
                        if (response.status != 200):
                            raise ValueError('Unexpected status')
                        elevation = int(response.read())
                        if (elevation < 0):
                            elevation = 0

                        # Compute distance
                        if previous:
                            distance = distance + haversine(c, previous)
                        previous = c

                        # Stash + show activity
                        profile.append([elevation, int(round(distance))])
                        sys.stdout.write('.')
                        sys.stdout.flush()
                        break
                    except ValueError:
                        print "Unexpected error:", sys.exc_info()[0]
                        retries = retries + 1
                        if retries > 5:
                            exit("Too many errors, aborting.")
                        print "Retry ", retries
                    finally:
                        conn.close()

        sys.stdout.write('\n')
        filename = 'elevation/elevation_%s.json' % i
        json.dump(profile, open(filename, 'w'))
        print filename + " written"
        break
