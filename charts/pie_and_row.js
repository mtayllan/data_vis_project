(async () => {
  const dataset = await wordkedWithDataset;

  const facts = crossfilter(dataset);
  const countryDim = facts.dimension(d => d.Country);
  const langDim = facts.dimension(d => d.LanguageWorkedWith);
  const langDimGroup = langDim.group()

  const sexualityDim = facts.dimension(d => d.Sexuality)

  const piechart = dc.pieChart("#languages-pie-chart");

  const all = facts.groupAll();

  piechart
    .width(450)
    .height(400)
    .slicesCap(5)
    .innerRadius(50)
    .dimension(countryDim)
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

    dc.renderAll();
})()
