
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

var map = L.mapbox.map('map', 'lxbarth.map-msx8qhha').setView([45.859, 2.791], 6);
new L.Hash(map);
map.attributionControl.addAttribution('Preliminary Tour de France 2013 data &copy; <a href="http://www.bikemap.net/route/1351870">Bikemap.net / Stef@n</a>');

// Tracks

function trackStyle(zoom) {
    return function(feature) {
        return {
            weight: zoom * zoom / 6,
            opacity: 0.9,
            color: '#FFB57A',
            fillOpacity: 0.9,
            fillColor: '#FFB57A'
        };
    };
}

for (var stage = 1; stage <= 21; stage++) {
    (function(stage) {
        loadJSON('data/tracks/track-' + stage + '.topojson', function(track) {
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

loadJSON('data/stages.json', function(stages) {
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
