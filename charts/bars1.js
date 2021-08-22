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

  const selectedLanguages = []

  const setHightlighted = (tech) => {
    selectedTechCircle = document.getElementById(`node-${tech}`);

    if(selectedTechCircle != 'null') {
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
  const getColor = (d) => {
    console.log({groupByName});
    console.log(d);

    return defaultOrdinalColorScale(groupByName(d.key));
  }

  const barChart = dc.barChart(document.querySelector("#bars1"))
    barChart.width(1000)
            .height(400)
            .gap(30)
            .dimension(finalDimension)
            .margins({top: 30, right: 50, bottom: 25, left: 100})
            .x(xScale)
            .y(yScale)
            .renderHorizontalGridLines(true)
            .colorCalculator(getColor)
            .group(finalGroup, 'Ganho por genero')
            .xUnits(dc.units.ordinal)
            .addFilterHandler((_, filter) => { setHightlighted(filter); return [filter];})
            .removeFilterHandler((_, filter) => { removeHighlight(filter); return [];})
    dc.renderAll();
})()
