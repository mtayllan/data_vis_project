(async () => {
  const links = await linksDataset;
  const nodes = await nodesDataset;

  const domain = d3.extent(nodes, d => d.nodesize);
  const sizeScale = d3.scaleLog(domain);

  const width = 800;
  const height = 600;

  const svg = d3.select('#network').append('svg')
    .attr('width', width).attr('height', height)
    .attr("viewBox", [-width / 2, -height / 2, width, height]);

  const forceSimulation = (nodes, links) =>
    d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.name))
      .force("charge", d3.forceManyBody().distanceMax(100))
      .force("center", d3.forceCenter());

  const link = svg.append('g')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('class', 'link');

  const node = svg.append('g')
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('class', 'node')
    .attr('id', d => `node-${d.name}`)
    .attr('r', d => sizeScale(d.nodesize) / 150)
    .attr('fill', d => defaultOrdinalColorScale(d.group))
    .attr('stroke', 'black')
    .attr('stroke-width', d => d.highlight ? 2 : 0);

  const ticked = () => {
    link.attr('x1', d => d.source.x);
    link.attr('y1', d => d.source.y);
    link.attr('x2', d => d.target.x);
    link.attr('y2', d => d.target.y);

    node.attr('cx', d => d.x);
    node.attr('cy', d => d.y);
  }

  const simulation = forceSimulation(nodes, links).on("tick", ticked);
  const drag = (simulation) => {
    const dragstarted = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    const dragged = (d) => {
      d.fx = d3.event.x
      d.fy = d3.event.y
    }

    const dragended = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  node.call(drag(simulation));

  node.append('title')
    .text(d => `Grupo ${d.group}: ${d.name} (${d.nodesize})`);

  const legend = svg.selectAll(".legend")
    .data(nodes.map(n => n.group).filter(onlyUnique).sort(function (a, b) { return a - b; }))
    .enter().append("g")
    .attr("transform", (d, i) => `translate(210,${i * 20})`);

  legend.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 5)
    .attr("fill", (d) => defaultOrdinalColorScale(d));

  legend.append("text")
    .attr("x", 10)
    .attr("y", 5)
    .text(d => groupsMap[d]);

  document.querySelector('#network').append(svg.node());
})();
