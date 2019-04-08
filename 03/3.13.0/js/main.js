/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 1 - Star Break Coffee
 */

// ============= Initializing portions independent of data ========================
const margin = { left: 80, right: 20, top: 50, bottom: 100 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;
let controlFlag = false;

const svg = d3
  .select('#chart-area')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

const mainGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

// point of origin generators:
const yValueGenerator = d3.scaleLinear().range([height, 0]);
const xValueGenerator = d3
  .scaleBand()
  .range([0, width])
  .padding(0.2);
// X axis label:
const xLabel = mainGroup
  .append('text')
  .attr('x', width / 2)
  .attr('y', height + 60)
  .attr('text-anchor', 'middle')
  .attr('font-size', 25)
  .text('Month');
// Y axis label:
const yLabel = mainGroup
  .append('text')
  .attr('x', -(height / 2)) // rotating affects the X,Y orientation, hence using height for X
  .attr('y', -60) // the origin point is also flipped, thus using negative values
  .attr('font-size', 25)
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90)');

const yAxisgroup = mainGroup.append('g').attr('class', 'y axis');
const xAxisGroup = mainGroup
  .append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0,' + height + ')');

const transition = d3.transition().duration(800);

const update = data => {
  let RevOrProfit = controlFlag ? 'revenue' : 'profit';

  // ================= Data dependent updates: ========================
  // update Y axis label
  yLabel.text(`${RevOrProfit}`.charAt(0).toUpperCase() + `${RevOrProfit}`.slice(1));

  // adding data dependent attributes during data update:
  xValueGenerator.domain(data.map(item => item.month));
  yValueGenerator.domain([
    0,
    d3.max(data, item => {
      return item[RevOrProfit];
    }),
  ]);

  // Re-render X,Y Axes
  const xAxisCall = d3.axisBottom(xValueGenerator);
  const yAxisCall = d3.axisLeft(yValueGenerator).tickFormat(function(d) {
    return '$' + d;
  });
  xAxisGroup.call(xAxisCall);
  yAxisgroup.call(yAxisCall);

  // ============= D3 Update pattern: ================================
  // 1. JOIN the data
  const rectangles = mainGroup.selectAll('rect').data(data);
  // 2. remove unnecessary data: .exit and .remove to remove the surplus elements based on data count and target element count
  rectangles.exit().remove();
  // 3. update old/ add new data: any callback passed in attr() has access to the iterator item due to selectAll
  // prettier-ignore
  rectangles.enter() // create new elements if any
    .append('rect')
        .attr('fill', 'green')
        .attr('y', yValueGenerator(0))
        .attr('x', function(d) {
            return xValueGenerator(d.month);
        })
        .attr('height', 0)
        .attr('width', xValueGenerator.bandwidth)
        .merge(rectangles) // merges existing elements with new; following code applies to both cases.
        .transition(transition)
            .attr('x', function(d) {
                return xValueGenerator(d.month);
            })
            .attr('width', xValueGenerator.bandwidth)
            .attr('y', function(d) {
                return yValueGenerator(d[RevOrProfit]);
            })
            .attr('height', function(d) {
                return height - yValueGenerator(d[RevOrProfit]);
            });
};

// fetch the data and call the updater:
d3.json('./data/revenues.json').then(data => {
  // coercing the revenue/profit strings to number:
  data.forEach(item => {
    item.revenue = +item.revenue;
    item.profit = +item.profit;
  });

  update(data);

  d3.interval(() => {
    update(data);
    controlFlag = !controlFlag;
  }, 2000);
});
