const geojson_path = 'assets/geojson/parcels.geojson'

let file = $.ajax({
    url: geojson_path,
    dataType: "json",
    success: console.log("County data successfully loaded."),
    error: function (xhr) {
        alert(xhr.statusText)
    }
})

$.when(file).done(function () {

    let layer = file.responseJSON

    // function highlightFeature(e) {
    //     var layer = e.target;

    //     layer.setStyle({
    //         weight: 5,
    //         color: '#ee4266',
    //         dashArray: '',
    //         fillOpacity: 0
    //     });

    //     if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    //         layer.bringToFront();
    //     }
    // }

    // function resetHighlight(e) {
    //     geojson.resetStyle(e.target);
    // }

    var lastClickedLayer = null

    function OnClickFeature(e) {
        if (lastClickedLayer !== null) {
            lastClickedLayer.setStyle({
                fillColor: '#37991e',
                fillOpacity: 0.2,
                weight: 2,
                color: '#f5b400',
                opacity: 1
            });
        }
        map.fitBounds(e.target.getBounds());
        var layer = e.target;

        lastClickedLayer = layer;

        layer.setStyle({
            weight: 5,
            color: '#f72585',
            dashArray: '',
            fillOpacity: 0
        });

        document.getElementById('parcelid').value = layer.feature.properties.PARCELID
        document.getElementById('parceldate').value = layer.feature.properties.PARCELDATE
        document.getElementById('parcelowner').value = layer.feature.properties.OWNERNME2
        document.getElementById('parceladdress').value = layer.feature.properties.SITEADRESS
        document.getElementById('deedacres').value = layer.feature.properties.DEEDACRES

    }

    function onEachFeature(feature, layer) {
        layer.on({
            // mouseover: highlightFeature,
            // mouseout: resetHighlight,
            click: OnClickFeature
        });
    }

    let geojson = L.geoJSON(layer, {
        onEachFeature: onEachFeature,
        style: function (feature) {
            return {
                fillColor: '#37991e',
                fillOpacity: 0.2,
                weight: 2,
                color: '#f5b400',
                opacity: 1
            }
        }
    })

    geojson.addTo(map)
})