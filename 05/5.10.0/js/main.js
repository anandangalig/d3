/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */

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

// scales: ============================================================
const y = d3
  .scaleLinear()
  .range([height, 0])
  .domain([0, 90]);

const x = d3
  .scaleLog()
  .base(10)
  .range([0, width])
  .domain([300, 150000]);

const getArea = d3
  .scaleLinear()
  .range([25 * Math.PI, 1500 * Math.PI])
  .domain([2000, 1400000000]);

const getContinentColor = d3.scaleOrdinal(d3.schemePastel1); // domain is omitted scaleOrdinal([[domain], range])

// X, Y axes ============================================================
const xAxisCall = d3
  .axisBottom(x)
  .tickValues([400, 4000, 40000])
  .tickFormat(d3.format('$'));
g.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0,' + height + ')')
  .call(xAxisCall);

const yAxisCall = d3.axisLeft(y);
g.append('g')
  .attr('class', 'y axis')
  .call(yAxisCall);

// labels: =============================================================
g.append('text')
  .attr('x', width / 2)
  .attr('y', height + 60)
  .attr('text-anchor', 'middle')
  .attr('font-size', 25)
  .text('Income');

g.append('text')
  .attr('x', -(height / 2)) // rotating affects the X,Y orientation, hence using height for X
  .attr('y', -60) // the origin point is also flipped, thus using negative values
  .attr('font-size', 25)
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90)')
  .text('Life Expectancy');

const yearText = g
  .append('text')
  .attr('x', width - 50)
  .attr('y', height - 50)
  .attr('text-anchor', 'middle')
  .attr('opacity', '0.4')
  .attr('font-size', 40);

// legend: ============================================================
const continents = ['africa', 'americas', 'asia', 'europe'];

const legend = g
  .append('g')
  .attr('class', 'HERE!')
  .attr('transform', `translate(${width - 10}, ${height - 200})`);

continents.map((continent, index) => {
  legend
    .append('rect')
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', getContinentColor(continent))
    .attr('transform', `translate(0, ${index * 20})`);

  legend
    .append('text')
    .attr('x', -5)
    .attr('y', 10)
    .attr('text-anchor', 'end')
    .style('text-transform', 'capitalize')
    .text(continent)
    .attr('transform', `translate(0, ${index * 20})`);
});

// update pattern ======================================================
// prettier-ignore
const update = data => {
  const t = d3.transition().duration(145);

  // 1. select, start the Data Join:
  // 2. .data() returns update items that are staying from old render to new render:
  const selection = g.selectAll('circle').data(data, function (d) { return d.country; });
  // the second parameter is a function that sets the key to each data point to keep the binding consistent to specific DOM elements  (i.e. paint the same continent with same color with each interval)

  // 3. remove DOM elements that are not present in the new data set:
  selection.exit().remove();

  // 4. create new ones:
  selection
    .enter()
    .append('circle')
    .attr('fill', d => {
      return getContinentColor(d.continent);
    })
    .merge(selection)
    .transition(t)
      .attr('cy', d => {
        return y(d.life_exp);
      })
      .attr('cx', d => {
        return x(d.income);
      })
      .attr("r", (d)=>{ return Math.sqrt(getArea(d.population) / Math.PI) })
      // population is converted to area in scale, then that vector is converted into diameter by dividing by Math.PI, then taken sq. root of it to get radius.
      .attr('data-country-name', (d)=>d.country);
};

// load data and graph: ================================================
d3.json('data/data.json').then(function(data) {
  // data is an array of 215 objects
  // Each object has countries array (254) and a year string (1800-2014)
  // Each country is an object with continent, country, income, life_exp, and population
  const cleanedData = data.map(each => {
    return each.countries.filter(country => {
      return country.income && country.life_exp;
    });
  });

  let arrayPosition = 0;

  update(cleanedData[arrayPosition]);

  d3.interval(() => {
    if (arrayPosition == 214) {
      arrayPosition = 0;
    } else {
      arrayPosition++;
    }
    let year = data[arrayPosition].year;
    yearText.text(year);
    update(cleanedData[arrayPosition]);
  }, 150);
});
