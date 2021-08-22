(async () => {
  const helloWorlds = await helloWorldsDataset;

  const width = 600;
  const height = 600;

  const svg = d3.select('#hello-worlds')

const selectedLanguages = helloWorlds.sort(() => Math.random() - Math.random()).slice(0, 3);

console.log(selectedLanguages)


  const mainDiv = svg
    .selectAll('div')
    .data(selectedLanguages)
    .enter()
    .append('div')
    .attr('class', 'col-4')
    .append('div')
    .attr('class', 'card')

    mainDiv.append('div')
    .attr('class', 'card-body')
    .style("text-align","left")
    .append('pre')
    .append('code')
    .text(d => `${d.program}`);

    mainDiv.append('h5')
    .attr('class', 'card-title')
    .text(d => `${d.language_name} (${d.extension === '' ? 'Sem extensão' : `.${d.extension}`})`);
    

  document.querySelector('#hello-worlds').append(svg.node());
})();
