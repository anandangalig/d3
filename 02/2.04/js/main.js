/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    2.4 - Adding SVGs with D3
 */

var svg = d3
  .select('#chart-area')
  .append('svg')
  .attr('width', 400)
  .attr('height', 400);

var circle = svg
  .append('circle')
  .attr('cx', 100)
  .attr('cy', 250)
  .attr('r', 70)
  .attr('fill', 'grey');

// ANAND's examples:
const svg_test = d3
  .select('#hello_d3')
  .append('svg')
  .attr('width', 500)
  .attr('height', 400);

const text = svg_test
  .append('text')
  .attr('x', 300)
  .attr('y', 300)
  .attr('font-family', 'sans-serif')
  .attr('font-size', '20px')
  .attr('fill', 'orange')
  .text('Hello D3.js!');

const rectangle = svg_test
  .append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('fill', 'blue')
  .attr('width', 150)
  .attr('height', 70);

const line = svg_test
  .append('line')
  .attr('x1', 120)
  .attr('y1', 120)
  .attr('x2', 300)
  .attr('y2', 200)
  .attr('stroke', 'red')
  .attr('stroke-width', 5);

const ellipse = svg_test
  .append('ellipse')
  .attr('cx', 100)
  .attr('cy', 250)
  .attr('rx', 30)
  .attr('ry', 70)
  .attr('fill', 'green');
