
// XHR/JSON helper
function loadJSON(path, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {
        if (xhr.readyState==4) {
            if (xhr.status==200) {
                callback(JSON.parse(xhr.responseText));
            } else {
                callback(null, xhr);
            }
        }
    };
    xhr.open('GET', path, true);
    xhr.send();
}

// Map

var map = L.mapbox.map('map', 'lxbarth.map-cw6frzzi').setView([45.859, 2.791], 6);
new L.Hash(map);
map.attributionControl.addAttribution('Preliminary Tour de France 2013 data &copy; <a href="http://www.bikemap.net/route/1351870">Bikemap.net / Stef@n</a>');

// Tracks

function trackStyle(zoom) {
    return function(feature) {
        return {
            weight: zoom * zoom / 6,
            opacity: 0.5,
            color: '#e04'
        };
    };
}

for (var stage = 1; stage <= 21; stage++) {
    (function(stage) {
        loadJSON('data/tracks/track-' + stage + '.topojson', function(track, err) {
            if (err) return console.error(err);
            var json = topojson.object(track, track.objects['track-' + stage]);
            var layer = L.geoJson(json, {
                style: trackStyle(5),
            }).addTo(map);
            layer.setZIndex(5);
            map.on('zoomend', function() {
                layer.setStyle(trackStyle(map.getZoom()));
            });
        });
    })(stage);
}

// Roads

var roadsPane = map._createPane('leaflet-roads-pane', map.getPanes().mapPane);
var roadsLayer = L.mapbox.tileLayer('lxbarth.map-vtt23b1i').addTo(map);
roadsPane.appendChild(roadsLayer.getContainer());
roadsLayer.setZIndex(9);

// Markers

loadJSON('data/stages.json', function(stages, err) {
    if (err) return console.error(err);
    for (var i in stages.features) {
        var stage = stages.features[i];
        var p = stage.properties;
        var stageIcon = L.divIcon({
            className: 'stage-marker',
            iconSize: new L.Point(30, 30),
            html: '<div class="stage-label" id="' + p.ordinal + '">' + p.ordinal + '</div>'
        });
        var marker = new L.Marker(new L.LatLng(
            stage.geometry.coordinates[1],
            stage.geometry.coordinates[0]), {
            icon: stageIcon,
            style: {width: '100px'}
        });
        (function(marker, stage) {
            marker.on('click', function() {
                loadElevation(stage);
            })
        })(marker, p.ordinal);
        var o = '';
        o += '<div class="date">' + p.date + '</div>';
        o += '<div class="stage">Stage ' + p.ordinal + '</div>';
        o += '<div class="name"><a href="' + p.url + '">' + p.name + '</a></div>';
        o += '<div class="distance">' + p.distance + '</div>';
        if (p.type) {
            o += '<div class="type">' + p.type + '</div>';
        }
        marker.bindPopup(o);
        marker.addTo(map);
    }
});

function loadElevation(stage) {
    loadJSON('data/elevation/elevation_' + stage + '.json', function(data, err) {
        if (err) return console.error(err);
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 300 - margin.left - margin.right,
            height = 150 - margin.top - margin.bottom;

        var x = d3.scale.linear()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(5)
            .tickFormat(function(d) { return d / 1000; });

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5);

        var line = d3.svg.line()
            .x(function(d) { return x(d[1]); })
            .y(function(d) { return y(d[0]); });

        document.getElementById('elevation').innerHTML = "";
        var svg = d3.select("#elevation").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(data, function(d) { return d[1]; }));
        y.domain(d3.extent(data, function(d) { return d[0]; }));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Elevation (m)");

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);
    });
}
