(async () => {
  const tags = await tagsDataset;
  const nodes = await nodesDataset;

  const facts = crossfilter(tags);
  const dimension = facts.dimension(d => d.name);
  const topGroup = dimension.group().reduceSum(d => d.count).top(15);
  const finalDimension = crossfilter(topGroup).dimension(d => d.key);
  const finalGroup = finalDimension.group().reduceSum(d => d.value);
  const names = finalGroup.top(Infinity).map(d => d.key);

  const xScale = d3.scaleOrdinal().domain(names);
  const yScale = d3.scaleLinear().domain([0,  finalGroup.top(1)[0].value]);

  const setHightlighted = (tech) => {
    nodes.forEach(node => {
      node.highlight = node.name == tech;
    });
  }

  let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  const groupByName = (name) => nodes.find(no => no.name === name).group;

  // NÃO TIRAR
  // esse console.log é necessário pro javascript esperar terminar de rodar pra depois mostrar os gráficos
  console.log(nodes.map( n => colorScale(groupByName(n.name)) ))

  const barChart = dc.barChart(document.querySelector("#bars1"))
    barChart.width(1000)
            .height(400)
            .gap(30)
            .dimension(finalDimension)
            .margins({top: 30, right: 50, bottom: 25, left: 100})
            .x(xScale)
            .y(yScale)
            .renderHorizontalGridLines(true)
            .colorCalculator(d => colorScale(groupByName(d.key)))
            .group(finalGroup, 'Ganho por genero')
            .xUnits(dc.units.ordinal)
            .addFilterHandler((_, filter) => { setHightlighted(filter); return [filter];})
            .removeFilterHandler(() => { setHightlighted(''); return [];})
    dc.renderAll();
})()
