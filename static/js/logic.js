// import API key
import { API_KEY } from "./config.js";

// console.log to confirm the key has been imported
// console.log(API_KEY);

let url = API_KEY;

// GET request on API
d3.json(url).then(function (data) {
  createFeatures(data.features);
  //   console.log(API_KEY);
});

function createFeatures(earthquakeData) {
  function magnitudeColor(depth) {
    if (depth <= 10) return "#0CE49F";
    else if (depth <= 30) return "#0EE40C";
    else if (depth <= 50) return "#D5E40C";
    else if (depth <= 70) return "#E4760C";
    else if (depth <= 90) return "#E40C0C";
    // else return "black";
  }

  function style(data) {
    return {
      opacity: 0.5,
      fillOpacity: 0.5,
      weight: 3.5,
      fillColor: magnitudeColor(data.geometry.coordinates[2]),
      color: "white",
      radius: data.properties.mag * 9,
    };
  }

  function onEachFeature(feature, layer) {
    layer.bindPopup(
      `<h3>${feature.properties.place}</h3><hr><p>${new Date(
        feature.properties.time
      )}</p>`
    );
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlong) {
      return L.circleMarker(latlong);
    },
    onEachFeature: onEachFeature,
    style: style,
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

  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo,
  };

  var overlayMaps = {
    Earthquakes: earthquakes,
  };

  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [street, earthquakes],
  });
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {
    let div = L.DomUtil.create("div", "info legend"),
      depth = [-10, 10, 30, 50, 70, 90],
      colors = [
        "#00FF00",
        "#0CE49F",
        "#0EE40C",
        "#D5E40C",
        "#E4760C",
        "#E40C0C",
      ];
    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        colors[i] +
        '"></i> ' +
        depth[i] +
        (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+");
    }
    return div;
  };
  // Adding legend to the map
  legend.addTo(myMap);
}
