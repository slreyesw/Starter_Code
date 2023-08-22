// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(queryUrl).then(function(data) {
    createFeatures(data.features)
})


//create colors for depth/legend
function color(depth) {
    if (depth < 10) return 'green'
    else if (depth <30) return 'greenyellow'
    else if (depth <50) return 'yellow'
    else if (depth <70) return 'orange'
    else if (depth <90) return 'orangered'
    else return 'red'

}


// create circle marker
function pointToLayer(feature, latlng) {

    return L.circleMarker(latlng, {
        fillOpacity: 0.75,
        color: color(feature.geometry.coordinates[2]),
        fillColor: color(feature.geometry.coordinates[2]),
        radius: feature.properties.mag * 5
    })
}

//create features/pop up
function createFeatures(earthquakeData) {

    function onEachFeature (feature, layer) {
        layer.bindPopup(`<h3> <p> Location: ${feature.properties.place} </p> Magnitude: ${feature.properties.mag}</h3><hr><p> Depth: ${feature.geometry.coordinates[2]}</p>`);
    
    }

    let earthquakes= L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    })

    createMap(earthquakes)
}

function createMap(earthquakes) {
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

    let baseMaps = {
    "Street Map": street
  }

    let overlayMaps = {
    Earthquakes: earthquakes
  }

    let myMap = L.map("map", {
        center: [
        37.09, -95.71
        ],
        zoom: 5,
        layers: [street, earthquakes]})
    
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap)

// legend creation 
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let depths = [-10,10, 30,50, 70,90]; 
        let color = ["#00FF00", "#adff2f", "#FFFF00", "#FFA500", "#ff4500", "#FF0000"];
        

        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
            "<i style='background:" + color[i] + "'></i>" +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
    
    return div;
    
    };

    legend.addTo(myMap);
  
}