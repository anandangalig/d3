/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    2.8 - Activity: Your first visualization!
 */

d3.json('./data/buildings.json')
  .then(data => {
    data.map(item => {
      item.height = +item.height;
    });

    const svg = d3
      .select('#chart-area')
      .append('svg')
      .attr('height', 500)
      .attr('width', 500);

    const bars = svg.selectAll('rect').data(data); // <rect> elements are not created at this point, but we are nevertheless, looking for all of them and passing in the data array

    bars
      .enter() // loops over the data array
      .append('rect')
      .attr('x', (data, index) => {
        return index * 50 + 50;
      })
      .attr('y', 10)
      .attr('height', (data, index) => {
        return data.height;
      })
      .attr('width', 5)
      .attr('fill', 'red');
  })
  .catch(err => {
    console.error(err);
  });
