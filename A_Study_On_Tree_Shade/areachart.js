/*globals d3*/
d3.csv("assignment2.csv", d3.autoType).then(data => {
  console.log(data);

  const width = 200; // Width of the area chart
  const height = 200; // Height of the area chart

  const svg = d3
    .select("#area_chart")
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height]);

  const size = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.count))
    .range([5, 15]);

  data.forEach(d => {
    d.shadeScore = (d.count * d.Diameter_a) / 10;
    d.r = size(d.count);
  });

  const colorScale = d3
    .scaleOrdinal()
    .domain(data.map(d => d.families))
    .range(d3.schemeCategory10);

  const sim = d3
    .forceSimulation()
    .nodes(data)
    .force("charge", d3.forceManyBody().strength(5))
    .force("center", d3.forceCenter())
    .force("collide", d3.forceCollide().radius(d => d.r));

  const drag = d3
    .drag()
    .on("start", event => {
      sim.alphaTarget(0.3).restart();
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    })
    .on("drag", event => {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    })
    .on("end", event => {
      sim.alphaTarget(0.0);
      event.subject.fx = null;
      event.subject.fy = null;
    });

  const nodes = svg
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("fill", d => colorScale(d.families))
    .attr("stroke", "black")
    .attr("r", d => d.r);

  // Slider Scale setup
  const sliderWidth = 200;
  const sliderHeight = 50;
  const sliderMargin = { top: 10, right: 30, bottom: 10, left: 30 };

  const sliderSvg = d3
    .select("#shade_slider")
    .append("svg")
    .attr("viewBox", [0, 0, sliderWidth, sliderHeight]);

  const shadeScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.shadeScore))
    .range([sliderMargin.left, sliderWidth - sliderMargin.right]);

  // Add the slider bar
  sliderSvg.append("line")
    .attr("x1", shadeScale.range()[0])
    .attr("x2", shadeScale.range()[1])
    .attr("y1", sliderHeight / 2)
    .attr("y2", sliderHeight / 2)
    .attr("stroke", "black");

  // Function to update the slider
  function updateSlider(shadeScore) {
    // Remove existing plot
    sliderSvg.selectAll(".shade-plot").remove();

    // Add new plot
    sliderSvg.append("circle")
      .attr("class", "shade-plot")
      .attr("cx", shadeScale(shadeScore))
      .attr("cy", sliderHeight / 2)
      .attr("r", 5)
      .attr("fill", "red");
  }

  // Create a group for labels at the bottom of the visualization
  const labelGroup = svg.append("g")
    .attr("class", "label-group")
    .attr("transform", `translate(0, ${height / 2 - 20})`);

  // Modify the mouseover event to include 'Diameter_a', 'Shade Score', and slider update
  nodes.on("mouseover", (event, d) => {
    // Remove existing labels
    labelGroup.selectAll("*").remove();

    // Append new label for the hovered circle
    labelGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "5px")
      .attr("fill", "black")
      .text(`Count: ${d.count}, Family: ${d.families}, Diameter: ${d.Diameter_a.toFixed(2)}, Shade Score: ${d.shadeScore.toFixed(2)}`);

    // Update the slider with the current 'Shade Score'
    updateSlider(d.shadeScore);
  });

  nodes.call(drag);

  sim.on("tick", () => {
    nodes.attr("cx", d => d.x)
         .attr("cy", d => d.y);
  });
});
