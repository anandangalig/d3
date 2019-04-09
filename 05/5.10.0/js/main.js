/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */

d3.json('data/data.json').then(function(data) {
  let firstYear = data[0];
  firstYear.countries = firstYear.countries.filter(country => {
    return country.income && country.life_exp;
  });

  update(firstYear);
});

const margin = { left: 80, right: 20, top: 50, bottom: 100 };
const width = 700 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;
const svg = d3
  .select('#chart-area')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

// main group:
const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

// scales:
const y = d3
  .scaleLinear()
  .range([height, 0])
  .domain([0, 90]);
const x = d3
  .scaleLog()
  .base(10)
  .range([0, width])
  .domain([300, 150000]);
const area = d3
  .scaleLinear()
  .range([5, 40])
  .domain([2000, 1400000000]);
// const area = d3
//   .scaleLinear()
//   .range([25 * Math.PI, 1500 * Math.PI])
//   .domain([2000, 1400000000]);

// X axis
const xAxisCall = d3
  .axisBottom(x)
  .tickValues([400, 4000, 40000])
  .tickFormat(d3.format('$'));
g.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0,' + height + ')')
  .call(xAxisCall);
// Y axis
const yAxisCall = d3.axisLeft(y);
g.append('g')
  .attr('class', 'y axis')
  .call(yAxisCall);
// labels:
const xLabel = g
  .append('text')
  .attr('x', width / 2)
  .attr('y', height + 60)
  .attr('text-anchor', 'middle')
  .attr('font-size', 25)
  .text('Income');
const yLabel = g
  .append('text')
  .attr('x', -(height / 2)) // rotating affects the X,Y orientation, hence using height for X
  .attr('y', -60) // the origin point is also flipped, thus using negative values
  .attr('font-size', 25)
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90)')
  .text('Life Expectancy');

// update pattern
const update = data => {
  const selection = g.selectAll('circle').data(data.countries);
  selection.exit().remove();
  selection
    .enter()
    .append('circle')
    .attr('cy', d => {
      return y(d.life_exp);
    })
    .attr('cx', d => {
      return x(d.income);
	})
	// .attr("r", (d)=>{ return Math.sqrt(area(d.population) / Math.PI) });
    .attr('r', d => {
      return area(d.population);
    });
};
