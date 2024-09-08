/* global mapboxgl */

mapboxgl.accessToken =
  "pk.eyJ1Ijoia3Jpc3RlbmNodW5nIiwiYSI6ImNsb2VmZjFzNzA1dHAycnFya2p2YXNieDkifQ.PJK6f_RpoABfBfVhkd7Trg";

// Create a new Mapbox map
var map = new mapboxgl.Map({
  container: "map", // Specify the HTML element to contain the map
  style: "mapbox://styles/mapbox/outdoors-v12", // Use a Mapbox style
  center: [-71.16349213060396, 42.70733913943111], // Set the initial map center
  zoom: 12, // Set the initial zoom level
});

// Disable default box zooming for box-select
map.boxZoom.disable();

// Function for setting up the map
export function setupMap(data) {
  console.log(data);

  // Add a new source to the map
  map.addSource("tree-data", {
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

  // Add a heatmap layer to display the tree density
  map.addLayer({
    id: "tree-heatmap",
    type: "heatmap",
    source: "tree-data",
    maxzoom: 15,
    paint: {
      // Increase the heatmap weight based on frequency and property magnitude
      "heatmap-weight": [
        "interpolate",
        ["linear"],
        ["get", "Count"],
        0, 0,
        6, 1
      ],
      // Increase the heatmap color weight by zoom level
      "heatmap-intensity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0, 1,
        15, 3
      ],
      // Color ramp for heatmap. Transition from green (low) to red (high)
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0, "rgba(33,102,172,0)",
        0.2, "rgb(103,169,207)",
        0.4, "rgb(209,229,240)",
        0.6, "rgb(253,219,199)",
        0.8, "rgb(239,138,98)",
        1, "rgb(178,24,43)"
      ],
      // Adjust the heatmap radius by zoom level
      "heatmap-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0, 2,
        15, 20
      ],
      // Transition from heatmap to circle layer by zoom level
      "heatmap-opacity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        14, 1,
        15, 0
      ],
    },
  });
}

// Function for updating the map with new data
export function updateMap(data) {
  // Remove the existing source and layer
  map.removeLayer("tree-heatmap");
  map.removeSource("tree-data");

  // Call the setupMap function with the new data
  setupMap(data);
}
