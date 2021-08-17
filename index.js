const ready = ([tags, links, nodes]) => {
  const buildnet = () => {
    const width = 600;
    const height = 600;

    const svg = d3.select('#network').append('svg')
                  .attr("viewBox", [-width / 2, -height / 2, width, height]);

    const forceSimulation = (nodes, links) =>
      d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.name))
        .force("charge", d3.forceManyBody().distanceMax(100))
        .force("center", d3.forceCenter());


    // Crie a constante simulation usando a função forceSimulation definida em outra célula
    const simulation = forceSimulation(nodes, links).on("tick", ticked);

    //Crie os elementos svg para os links e guarde-os em link
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link');

    //Crie os elementos svg para os nodes e guarde-os em node
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', d => sizeScale(d.nodesize)/150)
      .attr('fill', d => colorScale(d.group))
      .attr('stroke', 'black')
      .attr('stroke-width', d => d.highlight ? 2 : 0)
      .call(drag(simulation));

    node.append('title')
        .text(d => `Grupo ${d.group}: ${d.name} (${d.nodesize})`);

    // Defina a função ticked
    function ticked() {
      link.attr('x1', d => d.source.x);
      link.attr('y1', d => d.source.y);
      link.attr('x2', d => d.target.x);
      link.attr('y2', d => d.target.y);

      node.attr('cx', d => d.x);
      node.attr('cy', d => d.y);
    }

    d3.select('#network').select('svg').remove();
    document.querySelector('#network').append(svg.node());
  }

  const buildbar = () => {
    const facts = crossfilter(tags);
    const dimension = facts.dimension(d => d.name);
    const topGroup = dimension.group().reduceSum(d => d.count).top(15);
    const finalDimension = crossfilter(topGroup).dimension(d => d.key);
    const finalGroup = finalDimension.group().reduceSum(d => d.value);
    const names = finalGroup.top(Infinity).map(d => d.key);

    const xScale = d3.scaleOrdinal().domain(names);
    const yScale = d3.scaleLinear().domain([0,  finalGroup.top(1)[0].value]);

    const barChart = dc.barChart(document.querySelector("#chart"))
    barChart.width(1000)
            .height(400)
            .gap(30)
            .dimension(finalDimension)
            .margins({top: 30, right: 50, bottom: 25, left: 100})
            .x(xScale)
            .y(yScale)
            .renderHorizontalGridLines(true)
            .group(finalGroup, 'Ganho por genero')
            .xUnits(dc.units.ordinal)
            .addFilterHandler((_, filter) => { setHightlighted(filter); buildnet(); return [filter];})
            .removeFilterHandler(() => { setHightlighted(''); buildnet(); return [];})
    dc.renderAll();
  }

  const setHightlighted = (tech) => {
    nodes.forEach(node => {
      node.highlight = node.name == tech;
    });
  }

  const domain = d3.extent(nodes, d => parseFloat(d.nodesize))
  const sizeScale = d3.scaleLog(domain)
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  function drag(simulation) {
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
  }

  buildbar();
  buildnet();
};

const promisses = [
  d3.csv('./Top Tags Count StackOverflow.csv', (data) => {
    return { name: data.name,  count: parseInt(data.count) }
  }),
  d3.csv('./stack_network_links.csv'),
  d3.csv('./stack_network_nodes.csv'),
];

Promise.all(promisses).then(ready);
