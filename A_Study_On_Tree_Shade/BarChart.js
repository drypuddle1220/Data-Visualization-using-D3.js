/* global d3 */
export default function BarChart(container){
  const margin = ({top: 20, right: 30, bottom: 40, left: 50});
  const width = 450 - margin.left - margin.right;
  const height = 150 - margin.top - margin.bottom;
  
  const x = d3.scaleLinear() // or scaleTime() if your x-axis is time-based
    .range([0, width]);
  const y = d3.scaleLinear()
    .range([height, 0]);
  
  const svg = d3.select(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  const xAxisGroup = svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`);
  
  xAxisGroup.append("text") // x-axis label
    .attr("x", width / 2)
    .attr("y", 35)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("Year");
  
  svg.append("g")
    .attr("class", "y-axis")
    .append("text") // y-axis label
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -35)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("Tree Count");

  const line = d3.line()
    .x(d => x(d[0]))
    .y(d => y(d[1]));
  
  function update(data){
    x.domain(d3.extent(data, d => d[0]));
    y.domain([0, d3.max(data, d => d[1]) + 10]);
    
    // Add the line
    svg.selectAll(".line")
      .data([data])
      .join("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add circles at each data point
    svg.selectAll("circle")
      .data(data)
      .join("circle")
      .attr("fill", "red")
      .attr("cx", d => x(d[0]))
      .attr("cy", d => y(d[1]))
      .attr("r", 4);

    const xAxis = d3.axisBottom(x);
    xAxisGroup.call(xAxis)
      .selectAll("text")
        .attr("transform", "rotate(-45)") // Rotate the text
        .style("text-anchor", "end"); // Adjust text-anchor for slanted labels

    const yAxis = d3.axisLeft(y).ticks(4);
    svg.select(".y-axis").call(yAxis);
  }
  return {
    update // return a chart object with a method to update it
  }
}