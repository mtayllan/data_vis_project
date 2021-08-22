(async () => {
  const tags = await tagsDataset;
  const nodes = await nodesDataset;

  const facts = crossfilter(tags);
  const dimension = facts.dimension(d => d.name);
  const group = dimension.group().reduceSum(d => d.count);
  const names = group.top(Infinity).map(d => d.key);

  const xScale = d3.scaleLinear().domain([0, group.top(1)[0].value]);

  const selectedLanguages = []

  const setHightlighted = (tech) => {
    selectedTechCircle = document.getElementById(`node-${tech}`);

    if (selectedTechCircle != 'null') {
      if (selectedLanguages.length >= 1) {
        selected = document.getElementById(`node-${selectedLanguages[0]}`);
        selected.style['stroke-width'] = '0px';

        removeLanguage(selectedLanguages[0])
      }

      selectedLanguages.push(tech)
      selectedTechCircle.style['stroke-width'] = '2px';
    }
  }

  const removeHighlight = (lang) => {
    selected = document.getElementById(`node-${lang}`);
    selected.style['stroke-width'] = '0px';
    removeLanguage(lang)
  }

  const removeLanguage = (lang) => {
    const index = selectedLanguages.indexOf(lang);
    if (index > -1) {
      selectedLanguages.splice(index, 1);
    }
  }

  const groupByName = (name) => nodes.find(no => no.name === name).group;

  const rowChart = new CustomRowChart('#top-row')
  rowChart.width(800)
    .height(400)
    .margins({ top: 30, right: 50, bottom: 25, left: 100 })
    .x(xScale)
    .xAxis(d3.axisTop())
    .elasticX(true)
    .dimension(dimension)
    .group(group)
    .cap(15)
    // .renderHorizontalGridLines(true)
    // .colorCalculator(d => defaultOrdinalColorScale(groupByName(d.key)))
    // .xUnits(dc.units.ordinal)
    // .addFilterHandler((_, filter) => { setHightlighted(filter); return [filter]; })
    // .removeFilterHandler((_, filter) => { removeHighlight(filter); return []; })

  rowChart.render();
})()
