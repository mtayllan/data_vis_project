(async () => {
  const links = await linksDataset2;
  const nodes = await nodesDataset;

  links.sort((a, b) => (a.value > b.value) ? -1 : 1)

  const uniqueSources = links.map(link => link.source).filter(onlyUnique).sort();

  const facts = crossfilter(links);
  const dimension = facts.dimension(d => d.target);
  const filterTargets = (tech) => links.filter(link => link.source == tech)
    .map(link => link.target);

  const buildbar = () => {
    const barChart = dc.barChart(document.querySelector("#bars"));
    const selectedTech = d3.select("#selected-dropdown select").node().value;
    const filteredTargets = filterTargets(selectedTech);

    const width = 600;
    const group = dimension.group().reduceSum(link => {
      if (link.source == selectedTech) {
        return link.value
      }
      return 0
    });

    const groupByName = (name) => {
      if (typeof name !== 'undefined') {
        return nodes.find(no => no.name === name).group
      }
    };

    barChart.width(width)
      .height(500)
      .gap(15)
      .dimension(dimension)
      .margins({ top: 30, right: 50, bottom: 50, left: 40 })
      .x(d3.scaleOrdinal().domain(filteredTargets.slice([0, 15])))
      .xUnits(dc.units.ordinal)
      .yAxisLabel(`Frequência com ${selectedTech}`)
      .xAxisLabel(`Tecnologia`)
      .colorAccessor(d => d.key)
      .renderHorizontalGridLines(true)
      .colorCalculator(d => {
        if (typeof groupByName(d.key) !== 'undefined') {
          return defaultOrdinalColorScale(groupByName(d.key))
        } else {
          return '#aaaa'
        }
      })
      .brushOn(false)
      .group(group)

    dc.renderAll()
  }


  d3.select('#selected-dropdown')
    .append('select')
    .attr('class', 'select form-select')
    .on('change', buildbar)
    .selectAll('option')
    .data(uniqueSources).enter()
    .append('option')
    .text(d => d);

  const svg = d3.select('#bars-legend')
    .append('svg')
    .attr('width', '100%')
    .attr('height', 100);

  const legend = svg.selectAll(".legend")
    .data(await getGroups())
    .enter().append("g")
    .attr("transform", (_, i) => `translate(${10 + (i % 3) * 200},${20 + Math.floor(i/3) * 30})`);

  legend.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 5)
    .attr("fill", (d) => defaultOrdinalColorScale(d));

  legend.append("text")
    .attr("x", 10)
    .attr("y", 5)
    .text(d => groupsMap[d]);


  buildbar();
})();
