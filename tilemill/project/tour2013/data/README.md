# Tour de France 2013 Preliminary Data

## Source

Bikemap.net / Stef@n

http://www.bikemap.net/route/1351870#lat=42.137182772149&lng=9.4126749999998&zoom=8&maptype=ts_terrain

Originally downloaded files in `originals/`.

## Conversion process

### (1) Convert GPX to shape files

- Input: `originals/*`
- Output: `01.shp/` ... `21.shp`

Open each GPX track in QGis and save export it at as shapefile. TODO: there has to be
a way to do this with `ogr2ogr`.

### (2) Merge Shapefiles into one

- Input: `01.shp/` ... `21.shp`
- Output: `tracks.shp` and `track_points.shp`

Run

    ./merge

### (3) Generate a JSON file of all stages + meta info

- Input: `track_points.shp`
- Output: `stages.json`

Run

    python stages.py

### (4) Generate a JSON file of all tracks

- Input: `tracks.shp`
- Output: `tracks.json`

Run

     ogr2ogr -f "GeoJSON" tracks.json tracks.shp tracks

### (5) Retrieve elevation points

- Input: `tracks.shp`
- Output: `elevation/*`

Run

    python elevation.py


