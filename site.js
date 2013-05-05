// Bug fix
L.Icon.Default.imagePath = 'http://api.tiles.mapbox.com/mapbox.js/v1.0.0beta0.0/images';

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
            var layer = L.geoJson(topojson.object(track, track.objects['track-' + stage]), {
                style: trackStyle(5),
            }).addTo(map);
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

function stageStyle(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: 8,
        fillColor: "#E0865D",
        color: "#fff",
        weight: 0,
        fillOpacity: 0.9
    });
}
function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.desc) {
        layer.bindPopup(feature.properties.desc);
    }
}

var topPane = map._createPane('leaflet-top-pane', map.getPanes().mapPane);
var topLayer = L.geoJson(stages, {
    pointToLayer: stageStyle,
    onEachFeature: onEachFeature
}).addTo(map); // Does not work https: //github.com/mapbox/labs/issues/54#issuecomment-16559568 // topPane.appendChild(topLayer.getContainer());
// topLayer.setZIndex(10);
