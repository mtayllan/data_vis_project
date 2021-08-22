const nodesDataset = d3.csv('./datasets/stack_network_nodes.csv', row => ({...row, nodesize: parseFloat(row.nodesize)}));
const linksDataset = d3.csv('./datasets/stack_network_links.csv', row => ({...row, value: parseFloat(row.value)}));
const linksDataset2 = d3.csv('./datasets/stack_network_links.csv', row => ({...row, value: parseFloat(row.value)}));
const tagsDataset = d3.csv('./datasets/tags.csv')
const popularityDataset = d3.csv('./datasets/popularity.csv').then(data => {
  const dateParser = d3.utcParse('%B %Y');
  data.forEach(item => {
    item.Date = dateParser(item.Date);
    Object.keys(item).forEach(key => {
      if (key != 'Date') item[key] = +item[key].replace(/,/g, '.')
    });
  })
  return data;
})
const matrixDataset = d3.text('../datasets/matrix_worked_and_desired.csv').then(data => {
  return d3.csvParseRows(data).map(i => i.map(j => parseInt(j)));
});

const defaultColors = d3.schemeTableau10;
const defaultOrdinalColorScale = d3.scaleOrdinal(defaultColors);

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
