function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

(async () => {
  const links = await linksDataset2;
  const nodes = await nodesDataset;

  links.sort((a, b) => (a.value > b.value) ? -1 : 1)

  const uniqueSources = links.map(link => link.source).filter(onlyUnique).sort();

  const facts = crossfilter(links);
  const dimension = facts.dimension(d => d.target);
  const filterTargets = (tech) => links.filter(link => link.source == tech)
                                      .map(link => link.target);
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);


  const buildbar = () => {
    const barChart = dc.barChart(document.querySelector("#bars2"));
    const selectedTech = d3.select("#selected-dropdown select").node().value;
    const filteredTargets = filterTargets(selectedTech);

    const width = 1000;
    const group = dimension.group().reduceSum(link => {
      if (link.source == selectedTech) {
        return link.value
      }
      return 0
    });

    const groupByName = (name) => {
      if(typeof name !== 'undefined') {
        return nodes.find(no => no.name === name).group
      }
    };

    // NÃO TIRAR
    // esse console.log é necessário pro javascript esperar terminar de rodar pra depois mostrar os gráficos
    console.log(nodes.map( n => colorScale(groupByName(n.name)) ))

    barChart.width(width) // variável padrão do obs, pega larguda da célula
      .height(500)
      .gap(30)
      .dimension(dimension)
      .margins({ top: 30, right: 50, bottom: 25, left: 40 })
      .x(d3.scaleOrdinal().domain(filteredTargets.slice([0, 15])))
      .xUnits(dc.units.ordinal)
      .colorAccessor(d => d.key)
      .renderHorizontalGridLines(true)
      .colorCalculator(d => {
        if(typeof groupByName(d.key) !== 'undefined') {
          return colorScale(groupByName(d.key))
        } else {
          return '#aaaa'
        }
      })
      .legend(dc.legend().x(width - 250).y(10).itemHeight(13).gap(5))
      .brushOn(false)
      .group(group, `Relação de ${selectedTech} com outras tecnologias`
      )

    dc.renderAll()
  }


  d3.select('#selected-dropdown')
    .append('select')
    .attr('class','select')
    .on('change', buildbar)
    .selectAll('option')
    .data(uniqueSources).enter()
    .append('option')
    .text(d => d);

  buildbar();
})();
