const nodesDataset = d3.csv('./stack_network_nodes.csv', row => ({...row, nodesize: parseFloat(row.nodesize)}));
const linksDataset = d3.csv('./stack_network_links.csv');

