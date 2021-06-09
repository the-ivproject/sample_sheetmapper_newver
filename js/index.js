// Google sheet name
const google_sheet_name = 'https://docs.google.com/spreadsheets/d/1re0UhMLlbNrI3Q2uPyFv97-TutFsZNvu'
// Sheet name
const sheet_name = 'Sheet1'

// Mapbox token
const mapbox_token = 'pk.eyJ1IjoiaXZwcm9qZWN0IiwiYSI6ImNrcDZuOWltYzJyeGMycW1jNDVlbDQwejQifQ.97Y2eucdbVp1F2Ow8EHgBQ'

// Point style 
let point_radius = 4
let point_color = 'red'

// Don't change anything below
var transformRequest = (url, resourceType) => {
    var isMapboxRequest =
        url.slice(8, 22) === "api.mapbox.com" ||
        url.slice(10, 26) === "tiles.mapbox.com";
    return {
        url: isMapboxRequest ?
            url.replace("?", "?pluginName=sheetMapper&") : url
    };
};

//YOUR TURN: add your Mapbox token
mapboxgl.accessToken = mapbox_token

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // YOUR TURN: choose a style: https://docs.mapbox.com/api/maps/#styles
    center: [112.632, -7.966], // starting position [lng, lat]
    zoom: 7, // starting zoom
    transformRequest: transformRequest
});

map.addControl(new mapboxgl.NavigationControl(), 'top-left');

$(document).ready(() => {
    $.ajax({
        type: "GET",
        //YOUR TURN: Replace with csv export link
        url: `${google_sheet_name}/gviz/tq?tqx=out:csv&sheet=${sheet_name}`,
        dataType: "text",
        success: function (csvData) {
            makeGeoJSON(csvData);
        }
    });

    let makeGeoJSON = csvData => {
        csv2geojson.csv2geojson(csvData, {
            latfield: 'Latitude',
            lonfield: 'Longitude',
            delimiter: ','
        }, (err, data) => {
            let addDataLayer = () => {
                var geo = {
                    'id': 'csvData',
                    'type': 'circle',
                    'source': {
                        'type': 'geojson',
                        'data': data
                    },
                    'paint': {
                        'circle-radius': point_radius,
                        'circle-color': point_color
                    }
                }
                geo.source.data.features.forEach(marker => {

                    let m = document.createElement('div')
                    m.className = 'marker'

                    new mapboxgl.Marker(m)
                        .setLngLat(marker.geometry.coordinates)
                        .addTo(map)

                })
            }

            map.on('style.load', () => {
                // Triggered when `setStyle` is called.
                if (data) addDataLayer();
            });

            map.on('load', () => {
                document.getElementById('basemaps').addEventListener('change', function () {
                    map.setStyle(`mapbox://styles/mapbox/${this.value}`)
                });

                addDataLayer()

                map.on('data', e => {
                    if (e.dataType === 'source' && e.sourceId === 'composite') {
                        document.getElementById("loader").style.visibility = "hidden";
                        document.getElementById("overlay").style.visibility = "hidden";
                    }
                    console.log(e)
                })
                map.on('click', a => {
                    // var features = map.queryRenderedFeatures(a.point);
                    console.log(a)
                        new mapboxgl.Popup()
                            .setLngLat(a.lngLat)
                            .setHTML(`<p>tes</p>`)
                            .addTo(map);

                })
                // Change the cursor to a pointer when the mouse is over the places layer.
                map.on('mouseenter', 'csvData', () => {
                    map.getCanvas().style.cursor = 'pointer';
                });

                // Change it back to a pointer when it leaves.
                map.on('mouseleave', 'places', () => {
                    map.getCanvas().style.cursor = '';
                });

                for (let i in data.features) {
                    let name = data.features[i].properties['Mountain Name']
                    let coor = data.features[i].geometry.coordinates
                    var opt = document.createElement('option');
                    opt.value = name;
                    opt.innerHTML = name;
                    opt.value = coor.join()
                    document.getElementById('inlineFormCustomSelect').appendChild(opt)
                }

                let UseBbox = () => {
                    let bbox = turf.bbox(data);
                    map.fitBounds(bbox, {
                        padding: 200
                    })
                }

                UseBbox()

                document
                    .getElementById('fitbound')
                    .addEventListener('click', UseBbox);

                let selOption = document.getElementById("inlineFormCustomSelect")

                selOption.addEventListener('change', function (a) {
                    let coor = (selOption[selOption.selectedIndex].value).split(",").map(a => {
                        return parseFloat(a)
                    })
                    if (selOption.value === 'Zoom to Extents') {
                        UseBbox()
                    } else {
                        map.flyTo({
                            center: coor,
                            zoom: 11
                        });
                    }
                })
            });
        });
    };
});