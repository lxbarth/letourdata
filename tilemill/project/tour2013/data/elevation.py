# TODO: Retrieve elevation profiles using Geonames elevation API
# http://www.geonames.org/export/web-services.html

from fiona import collection
import httplib
import json
import sys

for i in range(15, 19):
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
                        profile.append(int(response.read()))
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

        sys.sdout.write('\n')
        filename = 'stage_' + stage + '_elevation.json';
        json.dump(profile, open(filename, 'w'))
        print filename + " written"
