/* global d3 */

export default function species(data) {
  const margin = { top: 40, right: 10, bottom: 200, left: 40 };

  const width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const chart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  data.sort(function (a, b) {
    return b.Count - a.Count;
  });
  var x = d3
    .scaleBand()
    .domain(
      data.map(function (d) {
        return d.SPECIES;
      })
    )
    .range([0, 5 * width])
    .padding(0.1);

  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return d.Count;
      }),
    ])
    .range([height, 0]);


  chart
    .append("g")
    .attr("clip-path", "url(#clip-path)") // refer to the clip path
    .selectAll("rect") // select 'rect' elements within the clip path group
    .data(data) // bind data to the 'rect' elements
    .join("rect") // join data with 'rect' elements
    .attr("class", "bar")
    .attr("x", function (d) {
      return x(d.SPECIES); // use the x scale for positioning
    })
    .attr("y", function (d) {
      return y(d.Count); // use the y scale for positioning
    })
    .attr("height", function (d) {
      return height - y(d.Count); // set the height relative to the y scale
    })
    .attr("width", x.bandwidth())
    .attr("fill", "hsl(120, 50%, 40%)");

  const yAxis = d3.axisLeft(y).ticks(null, "s");
  chart.append("g").call(yAxis);

  const xAxis = d3.axisBottom(x).tickSizeOuter(0);
  
  // Add x-axis label
  svg
    .append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.top +150) // Adjust the 'y' value to control label position
    .text("Tree Species");

  
 // Add y-axis label
  svg
    .append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)") // Rotate the label for the y-axis
    .attr("clip-path", "url(#clip-path)") // apply the clip path to x-axis
    .attr("x", -height / 2)
    .attr("y", -15) // Adjust the 'y' value to control label position
    .text("Tree Count");

  chart
    .append("g")
    .attr("class", "x-axis")
    .attr("clip-path", "url(#clip-path)") // apply the clip path to x-axis
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text") // Select all the text elements in the x-axis
    .attr("class", "x-axis-label") // Add a class for styling;
    .attr("transform", "translate(-15,0)rotate(-60)") // Rotate the labels for readability
    .style("text-anchor", "end") // Adjust text-anchor for proper positioning
    .attr("x", 6) // Adjust the horizontal position
    .style("display", "none");

  // // clippath
  const clip = chart
    .append("clipPath")
    .attr("id", "clip-path")
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);
  const initialTransform = d3.zoomIdentity; // Default transform (most zoomed out)
  let labelsVisible = false;
  //  Zoom-related code
  const zoom = d3
    .zoom()
    .extent([
      [0, 0],
      [width, height],
    ])
    .translateExtent([
      [0, 0],
      [2 * width, height],
    ])
    .scaleExtent([1, 4])
    .on("zoom", zoomed);

  svg.call(zoom).call(zoom.transform, initialTransform);

  function zoomed(event) {
    // Update the x scale based on the zoom transform
    // Sort the selected data by 'Count' in descending order

    x.range([0, 2 * width].map((d) => event.transform.applyX(d)));

    // Update the positions and widths of the bars
    chart
      .selectAll(".bar")
      .attr("x", function (d) {
        return x(d.SPECIES);
      })
      .attr("width", x.bandwidth());

    // Update the x-axis based on the updated x scale
    chart.select(".x-axis").call(xAxis);
    // Show/hide labels based on zoom level
    if (event.transform.k > 1 && !labelsVisible) {
      chart.selectAll(".x-axis-label").style("display", "block");
      labelsVisible = true;
    } else if (event.transform.k <= 1 && labelsVisible) {
      chart.selectAll(".x-axis-label").style("display", "none");
      labelsVisible = false;
    };

  };
};

