/* global d3 */
export default function ScatterPlot(container){
  // initialization
  const margin = { top: 20, right: 30, bottom: 40, left: 55 };
  const width = 450 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const x = d3.scaleLinear().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  const svg = d3
    .select(".scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .append("text") // x-axis label
      .attr("x", width / 2)
      .attr("y", 35)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .text("Longitude");

  svg.append("g").attr("class", "y-axis")
  .append("text") // y-axis label
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -45)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .text("Latitude");

  
  // brush handling  ------------
  const brush = d3.brush()
    .extent([[0,0], [width, height]])
    .on("brush", brushed);
  
  svg.call(brush);
  
  // define your custom events
  const listeners = { "brush": null};
  
  function brushed(event){
    // convert pixel range to data range
    // [[x0, y0], [x1, y1]], where x0 is the minimum x-value,
    // y0 is the minimum y-value, x1 is the maximum x-value, and 
    // y1 is the maximum y-value
    const dataRange = event.selection.map(d=>[ x.invert(d[0]), y.invert(d[1]) ]);
    
    // take in to account that the y-scale range is [height, 0]
    const temp = dataRange[1][1];
    dataRange[1][1] = dataRange[0][1];
    dataRange[0][1] = temp;
    
    if (listeners["brush"]){
      listeners["brush"](dataRange);
    }
    
  }
  //------------------------------------
  
  // update the chart based on the data
  function update(data) {
    x.domain(d3.extent(data, d => d.Longitude));
    y.domain(d3.extent(data, d => d.Latitude));

    const density = data.map(d => {
    const closePoints = data.filter(p => 
      Math.abs(x(p.Longitude) - x(d.Longitude)) < 10 &&
      Math.abs(y(p.Latitude) - y(d.Latitude)) < 10
    );
    return closePoints.length;
  });

  svg
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("fill", "red")
    .attr("stroke", "none")
    .attr("cx", d => x(d.Longitude))
    .attr("cy", d => y(d.Latitude))
    .attr("r", 3)
    .style("opacity", (d, i) => 0.1 * density[i]);

    const xAxis = d3.axisBottom(x);
    svg.select(".x-axis").call(xAxis);

    const yAxis = d3.axisLeft(y);
    svg.select(".y-axis").call(yAxis);
  }
  
  // provide a way to register event listeners
  function on(eventname, callback){
    listeners[eventname] = callback;
  }
  return { // return a chart object with methods to update the chart and listen to events
    update,
    on
  }
}
