(async () => {
  const dataset = await wordkedWithDataset;

  const facts = crossfilter(dataset);
  const countryDim = facts.dimension(d => d.Country);
  const langDim = facts.dimension(d => d.LanguageWorkedWith);
  const langDimGroup = langDim.group()

  const ageDim = facts.dimension(d => d.Age);
  const ageDimGroup = ageDim.group()

  const piechart = dc.pieChart("#languages-pie-chart");
  const ageBarChart = dc.barChart('#ages-bar')

  const all = facts.groupAll();

  piechart
    .width(450)
    .height(400)
    .slicesCap(5)
    .innerRadius(50)
    .dimension(langDim)
    .group(langDimGroup)
    .legend(dc.legend().highlightSelected(true))
    .label(function(d) { return d.key + "(" + Math.floor(d.value / all.value() * 100) + "%)"; })
    .colors(defaultOrdinalColorScale)
    .externalRadiusPadding(70)
    .externalLabels(45);

  const rowChartCountry = new CustomRowChart('#countries-row-chart');

  rowChartCountry
    .width(500)
    .height(400)
    .margins({top: 20, left: 10, right: 10, bottom: 20})
    .othersGrouper(null)
    .transitionDuration(750)
    .colorAccessor((_, i) => i)
    .ordinalColors([defaultColors[0]])
    .dimension(countryDim)
    .group(countryDim.group().reduceCount())
    .renderLabel(true)
    .gap(1)
    .cap(12)
    .elasticX(true)
    .xAxis().ticks(4)

  rowChartCountry.on('preRedraw', function(chart) {
    chart.calculateColorDomain();
  });

  ageBarChart.width(700)
  .height(150)
  .margins({top: 10, right: 20, bottom: 20, left: 40})
  .dimension(ageDim)
  .group(ageDimGroup)
  .gap(70)
  .x(d3.scaleLinear().domain([ageDim.bottom(1)[0].Age, ageDim.top(1)[0].Age]))
  .elasticY(true)
  .centerBar(true)
  .renderHorizontalGridLines(true)

    dc.renderAll();
})()
