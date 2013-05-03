# Tour de France 2013 Preliminary Data

## Source

Bikemap.net / Stef@n

http://www.bikemap.net/route/1351870#lat=42.137182772149&lng=9.4126749999998&zoom=8&maptype=ts_terrain

Originally downloaded files in `originals/`.

## Conversion process

This conversion process is a bit roundabout as it literally follows the
steps I took to wrap my mind around this data and what's useful and not.

This is less a documentation to follow step-by-step but more a "historical"
explanation of the coming about of the files in this directory.

### (1) Convert GPX to shape files

- Input: `originals/*`
- Output: `01.shp/` ... `21.shp`

Open each GPX track in QGis and save export it at as shapefile. TODO: there has to be
a way to do this with `ogr2ogr`.

### (2) Create stages.json

All hand sourced from letour.com and start lat / lons from GPX files.

### (3) Merge Shapefiles into one

- Input: `01.shp/` ... `21.shp`
- Output: `tracks.shp` and `track_points.shp`

Run

    ./merge

There is a manual step where I went in and annotated start and end locations together
with meta information like stage number, name, length.

### (4) Generate a JSON file of all tracks

- Input: `tracks.shp`
- Output: `tracks.json`

Run

     ogr2ogr -f "GeoJSON" tracks.json tracks.shp tracks

### (5) Make a smaller topojson file out of it

- Input: `tracks.json`
- Output: `tracks.topojson`

    // Forgot the -q factor I used.
    topojson -o tracks.topojson tarcks.json

### (6) Retrieve elevation points

- Input: `tracks.shp`
- Output: `elevation/*`

Run

    python elevation.py

### (7) Generate track geojson files

(Aside from python and python dependencies requires topojson installed and in path)

- Input: `01.shp/` ... `21.shp`
- Input: `tracks/*`

Run

    python tracks.py
