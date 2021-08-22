(async () => {
  const dataset = await wordkedWithDataset;

  const facts = crossfilter(dataset);
  const countryDim = facts.dimension(d => d.Country);
  const langDim = facts.dimension(d => d.LanguageWorkedWith);
  const langDimGroup = langDim.group()
  const usersByLang = langDim.group().reduceCount()

  const userAmountByCountry = countryDim.group().reduceCount(d => d.Respondent)

  const usersByCountry = countryDim.group().reduceCount()

  const sexualityDim = facts.dimension(d => d.Sexuality)
  const usersBySexuality = sexualityDim.group().reduceCount()
  const sexualities = sexualityDim.group().top(Infinity).map(d => d.key)

  const piechart = dc.pieChart("#languages-pie-chart");

  piechart
    .width(250)
    .height(250)
    .slicesCap(6)
    .innerRadius(50)
    .dimension(countryDim)
    .group(langDimGroup)
    .legend(dc.legend().highlightSelected(true))

  const rowChartCountry = dc.rowChart('#countries-row-chart');

  rowChartCountry
    .width(1000)
    .height(500)
    .margins({top: 20, left: 10, right: 10, bottom: 20})
    .transitionDuration(750)
    .dimension(countryDim)
    .group(countryDim.group().reduceCount())
    .renderLabel(true)
    .gap(1)
    .cap(15)
    .elasticX(true)
    .xAxis().ticks(4);

    dc.renderAll();
})()
