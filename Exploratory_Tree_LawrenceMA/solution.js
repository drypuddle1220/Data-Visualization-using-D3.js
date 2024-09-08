/* globals d3 */
d3.csv('cities.csv', d=>{// alternative: d3.autoType
  return {
    ...d,
    eu: d.eu==='true',
    population: +d.population,
    x: +d.x,
    y: +d.y,
  }
}).then(data=>{
  const cities = data.filter(d=>d.eu);
  
  console.log('cities', cities);
  
  const width = 700;
  const height = 550;
  
  const svg = d3.select('.population-plot').append('svg')
    .attr('width', width)
    .attr('height', height);

  svg.selectAll('circle')
    .data(cities)
    .enter()
    .append('circle')
    .attr('fill', '#2196f3')
    .attr('r', d=>d.population<1000000?4:8)
    .attr('cx', d=>d.x)
    .attr('cy', d=>d.y);
  
  svg.selectAll('text')
    .data(cities)
    .enter()
    .filter(d=>d.population>1000000)
    .append('text')
    .attr('class',  'data-label')
    .text(d=>d.city)
    .attr('x', d=>d.x)
    .attr('y', d=>d.y)
    .attr('text-anchor', 'middle')
    .attr('dy', -12);
  
  d3.select('.city-count')
    .text('Number of Cities: ' + cities.length);
})

d3.csv('buildings.csv', d3.autoType).then(data=>{
  console.log('buildings',data);
  
  data.sort((a,b)=>b.height_px - a.height_px);
  
  const width = 500;
  const height = 500;
  const svg = d3.select('.heightchart').append('svg')
    .attr('width', width)
    .attr('height', height);
  
  
  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('fill', '#ff9800')
    .attr('x',180)
    .attr('y', (d,i)=>i*35)
    .attr('height', 30)
    .attr('width', d=>d.height_px)
    .on('click', (event,d)=>{
      console.log('clicked', d)
      d3.select('.image').attr('src', "https://cdn.glitch.com/a9660dae-4e11-4fbe-a37b-62b5ae9c3232%2F" + d.image)
      d3.select('.height').text(d.height_ft);
      d3.select('.city').text(d.city);
      d3.select('.city').text(d.city);
      d3.select('.floor').text(d.floors);
      d3.select('.completed').text(d.completed);
    });
  
  svg.selectAll('.category-label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'category-label')
    .attr('x', 0)
    .attr('y', (d,i)=>i*35)
    .attr('alignment-baseline', 'hanging')
    .attr('text-anchor', 'start')
    .attr('font-size', 11)
    .attr('dy', 10) 
    .text(d=>d.building);
  
  svg.selectAll('.value-label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'value-label')
    .attr('x', d=>180+d.height_px)
    .attr('y', (d,i)=>i*35)
    .attr('alignment-baseline', 'hanging')
    .attr('text-anchor', 'end')
    .attr('font-size', 11)
    .attr('dy', 10)
    .attr('dx', -10)
    .attr('fill', 'white')
    .text(d=>d.height_ft+' ft');

  
});