/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 1 - Star Break Coffee
 */

const margin = { left: 80, right: 20, top: 50, bottom: 100 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3
  .select('#chart-area')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

const group = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

// X axis label:
group
  .append('text')
  .attr('x', width / 2)
  .attr('y', height + 60)
  .attr('text-anchor', 'middle')
  .attr('font-size', 25)
  .text('Month');

// Y axis label:
group
  .append('text')
  .attr('x', -(height / 2)) // rotating affects the X,Y orientation, hence using height for X
  .attr('y', -60) // the origin point is also flipped, thus using negative values
  .attr('font-size', 25)
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90)')
  .text('Revenue');

d3.json('./data/revenues.json').then(data => {
  // coercing the revenue string to number:
  data.forEach(datum => {
    datum.revenue = +datum.revenue;
  });

  // ============= Helpers: ============================================
  const xValueGenerator = d3
    .scaleBand()
    .domain(data.map(datum => datum.month))
    .range([0, width])
    .padding(0.2);

  const yValueGenerator = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, datum => {
        // callback is optional: no need if working with simple array
        return datum.revenue;
      }),
    ])
    .range([height, 0]);

  // X Axis
  var xAxisCall = d3.axisBottom(xValueGenerator);
  group
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxisCall);

  // Y Axis
  var yAxisCall = d3.axisLeft(yValueGenerator).tickFormat(function(d) {
    return '$' + d;
  });
  group
    .append('g')
    .attr('class', 'y axis')
    .call(yAxisCall);

  // ============= Creating the shapes: ================================
  const rectangles = group.selectAll('rect').data(data);
  rectangles
    .enter() // any callback passed in attr() will have access to the iterator
    .append('rect')
    .attr('x', ({ month }) => xValueGenerator(month))
    .attr('y', ({ revenue }) => yValueGenerator(revenue))
    .attr('height', function(d) {
      return height - yValueGenerator(d.revenue); // since we have to paint down from the Y value of the rectangle origin point
    })
    .attr('width', xValueGenerator.bandwidth) // averaged width of each band after calculations of scaleBand()
    .attr('fill', 'green');
});
