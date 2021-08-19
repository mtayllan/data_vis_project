const nodesDataset = d3.csv('./stack_network_nodes.csv', row => ({...row, nodesize: parseFloat(row.nodesize)}));
const linksDataset = d3.csv('./stack_network_links.csv', row => ({...row, value: parseFloat(row.value)}));
const linksDataset2 = d3.csv('./stack_network_links.csv', row => ({...row, value: parseFloat(row.value)}));
const tagsDataset = d3.csv('./tags.csv')
const popularityDataset = d3.csv('popularity.csv').then(data => {
  const dateParser = d3.utcParse('%B %Y');
  data.forEach(item => {
    item.Date = dateParser(item.Date);
    item["Abap"] = +item["Abap"].replace(/,/g, '.')
    item["Ada"] = +item["Ada"].replace(/,/g, '.')
    item["C/C++"] = +item["C/C++"].replace(/,/g, '.')
    item["C#"] = +item["C#"].replace(/,/g, '.')
    item["Cobol"] = +item["Cobol"].replace(/,/g, '.')
    item["Dart"] = +item["Dart"].replace(/,/g, '.')
    item["Delphi"] = +item["Delphi"].replace(/,/g, '.')
    item["Go"] = +item["Go"].replace(/,/g, '.')
    item["Groovy"] = +item["Groovy"].replace(/,/g, '.')
    item["Haskell"] = +item["Haskell"].replace(/,/g, '.')
    item["Java"] = +item["Java"].replace(/,/g, '.')
    item["JavaScript"] = +item["JavaScript"].replace(/,/g, '.')
    item["Julia"] = +item["Julia"].replace(/,/g, '.')
    item["Kotlin"] = +item["Kotlin"].replace(/,/g, '.')
    item["Lua"] = +item["Lua"].replace(/,/g, '.')
    item["Matlab"] = +item["Matlab"].replace(/,/g, '.')
    item["Objective-C"] = +item["Objective-C"].replace(/,/g, '.')
    item["Perl"] = +item["Perl"].replace(/,/g, '.')
    item["PHP"] = +item["PHP"].replace(/,/g, '.')
    item["Python"] = +item["Python"].replace(/,/g, '.')
    item["R"] = +item["R"].replace(/,/g, '.')
    item["Ruby"] = +item["Ruby"].replace(/,/g, '.')
    item["Rust"] = +item["Rust"].replace(/,/g, '.')
    item["Scala"] = +item["Scala"].replace(/,/g, '.')
    item["Swift"] = +item["Swift"].replace(/,/g, '.')
    item["TypeScript"] = +item["TypeScript"].replace(/,/g, '.')
    item["VBA"] = +item["VBA"].replace(/,/g, '.')
    item["Visual Basic"] = +item["Visual Basic"].replace(/,/g, '.')
  })
  return data;
})
