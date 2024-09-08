/* global mapboxgl */

mapboxgl.accessToken = "pk.eyJ1Ijoia3Jpc3RlbmNodW5nIiwiYSI6ImNsb2VmZjFzNzA1dHAycnFya2p2YXNieDkifQ.PJK6f_RpoABfBfVhkd7Trg";

// Create a new Mapbox map for map2
var map2 = new mapboxgl.Map({
  container: "map2", // Specify a different HTML element to contain this map
  style: "mapbox://styles/mapbox/outdoors-v12",
  center: [-71.16349213060396, 42.70733913943111],
  zoom: 12,
});

// Disable default box zooming for box-select
map2.boxZoom.disable();

// Renamed function for setting up the second map
export function setupMap2(data) {
  console.log(data);

  // Add a new source to map2
  map2.addSource("listings", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: data.map(function (d) {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [d.Longitude, d.Latitude],
          },
          properties: {
            DATEPLANT: d.DATEPLANT,
            SPECIES: d.SPECIES,
            Diameter_a: d.Diameter_a,
            Count: d.Count,
          },
        };
      }),
    },
  });

  // Add a layer to display the points as circles
  map2.addLayer({
    id: "circle-layer",
    type: "circle",
    source: "listings",
    paint: {
      "circle-color": "green", // Set the circle color
      "circle-radius": 4.5, // Set the circle radius
    },
  });

  // Add a popup on click to display additional information
  map2.on("click", "circle-layer", function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var properties = e.features[0].properties;
    var popupContent = "<h3>" + properties.SPECIES + "</h3>";
    popupContent += "<p>Date Planted: " + properties.DATEPLANT + "</p>";
    popupContent += "<p>Diameter: " + properties.Diameter_a + "</p>";
    popupContent += "<p>Count: " + properties.Count + "</p>";
    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(popupContent)
      .addTo(map2);
  });

  // Change the cursor to a pointer when hovering over the points
  map2.on("mouseenter", "circle-layer", function () {
    map2.getCanvas().style.cursor = "pointer";
  });

  // Change it back to the default cursor when the mouse leaves the layer
  map2.on("mouseleave", "circle-layer", function () {
    map2.getCanvas().style.cursor = "";
  });
}

// Renamed function for updating the second map with new data
export function updateMap2(data) {
  // Remove the existing source and layer from map2
  map2.removeLayer("circle-layer");
  map2.removeSource("listings");

  // Call the setupMap2 function with the new data
  setupMap2(data);
}
