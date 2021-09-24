// import API key
import { API_KEY } from "./config.js";

// console.log to confirm the key has been imported
// console.log(API_KEY);

// GET request on API
d3.json(API_KEY).then(function (data) {
  createFeatures(data.features);
  //   console.log(API_KEY);
});

function createFeatures(earthquakeData) {
  function onEachFeature(feature, layer) {
    layer.bindPopup(
      `<h3>${feature.properties.place}</h3><hr><p>${new Date(
        feature.properties.time
      )}</p>`
    );
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Create the base layers.
  var street = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  var topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo,
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes,
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 1,
    layers: [street, earthquakes],
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);
}
