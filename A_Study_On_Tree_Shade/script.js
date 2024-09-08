/* global d3 */

// Set the access token (replace this with your own token)

import BarChart from "./BarChart.js";
import ScatterPlot from "./ScatterPlot.js";
import { setupMap, updateMap } from "./map.js";
//import { setupMap1, updateMap1 } from "./map2.js";

document.addEventListener("DOMContentLoaded", function () {
  d3.csv("revised-tree-plant-history-data-lawrence-ma-v2.csv", d3.autoType).then((data) => {
    setupMap(data);
//    setupMap1(data);

    // Add a dropdown for filtering DATEPLANT
    const dateplantOptions = [
      "All",
      ...Array.from(new Set(data.map((d) => d.DATEPLANT))),
    ];

    d3.select("#dateplant-dropdown")
      .selectAll("option")
      .data(dateplantOptions)
      .enter()
      .append("option")
      .text((d) => d)
      .attr("value", (d) => d);

    // Set default selection to "All" (showing all data)
    d3.select("#dateplant-dropdown").property("value", "All");

    d3.select("#dateplant-dropdown").on("change", function () {
      const selectedDateplant = this.value;

      const trimmedDateplant = selectedDateplant.trim();
      const filteredData =
        trimmedDateplant === "All"
          ? data
          : data.filter((d) => String(d.DATEPLANT).trim() === trimmedDateplant);

      console.log("Selected Dateplant:", selectedDateplant);
      console.log("Filtered Data Length:", filteredData.length);
      // Update the MapboxGL map with the filtered data
      updateMap(filteredData);
//      updateMap1(filteredData);
    });

    console.log(data);
    const scatterPlot = ScatterPlot(".scatterplot");
    const barChart = BarChart(".barchart");

    scatterPlot.update(data);

    // compute viewdata for a bar chart
    let origin = d3.rollups(
      data,
      (group) => group.length,
      (groupBy) => groupBy.DATEPLANT
    );
    barChart.update(origin); //update the bar chart

    // brush handling
    scatterPlot.on("brush", (dataRange) => {
      console.log(dataRange);

      const filtered = data.filter(
        (d) =>
          dataRange[0][0] <= d.Longitude &&
          d.Longitude < dataRange[1][0] &&
          dataRange[0][1] <= d.Latitude &&
          d.Latitude < dataRange[1][1]
      );

      // compute viewdata for a bar chart
      let origin = d3.rollups(
        filtered,
        (group) => group.length,
        (groupBy) => groupBy.DATEPLANT
      );
      barChart.update(origin); //update the bar chart
    });

    species(data);
  });
});

// reference:
// https://observablehq.com/@d3/d3-group
