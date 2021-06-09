const map = L.map('map', null, { zoomControl:true }).setView([43.329, -88.161], 16);
let layer = L.esri.basemapLayer('Topographic').addTo(map);
let layerLabels;

function setBasemap(basemap) {
    if (layer) {
        map.removeLayer(layer);
    }

    layer = L.esri.basemapLayer(basemap);

    map.addLayer(layer);

    if (layerLabels) {
        map.removeLayer(layerLabels);
    }

    if (
        basemap === 'ShadedRelief' ||
        basemap === 'Oceans' ||
        basemap === 'Gray' ||
        basemap === 'DarkGray' ||
        basemap === 'Terrain'
    ) {
        layerLabels = L.esri.basemapLayer(`${basemap}Labels`);
        map.addLayer(layerLabels);
    } else if (basemap.includes('Imagery')) {
        layerLabels = L.esri.basemapLayer('ImageryLabels');
        map.addLayer(layerLabels);
    }
}

let basemaps = document.getElementById('inlineFormCustomSelect');

basemaps.addEventListener('change', function () {
    setBasemap(basemaps.value);
});

    
function ZoomIn() {
    map.zoomIn();
}

function ZoomOut() {
    map.zoomOut();
}

function FitBound() {
    map.setView([43.329, -88.161], 16)
}

