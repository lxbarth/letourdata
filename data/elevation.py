# TODO: Retrieve elevation profiles using Geonames elevation API
# http://www.geonames.org/export/web-services.html

from fiona import collection
import httplib
import json
import sys

for i in range(1, 22):
    stage = "%02d" % i;
    print "Retrieving elevation data for " + stage + ".shp/tracks.shp"
    with collection(stage + ".shp/tracks.shp", "r") as input:
        profile = []
        for track in input:
            for c in track['geometry']['coordinates']:
                retries = 0
                while True:
                    try:
                        conn = httplib.HTTPConnection("api.geonames.org")
                        conn.request('GET', "/srtm3?lat=" + `c[1]` + "&lng=" + `c[0]` + "&username=lxbarth")
                        response = conn.getresponse()
                        if (response.status != 200):
                            raise ValueError('Unexpected status')
                        elevation = int(response.read())
                        if (elevation < 0):
                            elevation = 0
                        profile.append(elevation)
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
        filename = 'elevation/stage_%s_elevation.json' % i
        json.dump(profile, open(filename, 'w'))
        print filename + " written"
