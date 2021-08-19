(async () => {
  const dataset = await popularityDataset;

  const languages = ["Abap", "Ada", "C/C++", "C#", "Cobol", "Dart", "Delphi", "Go", "Groovy", "Haskell", "Java", "JavaScript", "Julia", "Kotlin", "Lua", "Matlab", "Objective-C", "Perl", "PHP", "Python", "R", "Ruby", "Rust", "Scala", "Swift", "TypeScript", "VBA", "Visual Basic"];
  const facts = crossfilter(dataset)
  const dateDim = facts.dimension(d => d.Date)
  const xScale = d3.scaleTime().domain([dateDim.bottom(1)[0].Date, dateDim.top(1)[0].Date])
  const languageColorScale = d3.scaleOrdinal()
    .domain(languages)
    .range(["#00A1EA", "#14127B", "#A8B9CC", "#9B6CD7", "#2ADF32", "#04599C", "#E7273A", "#00ABD8", "#569ABD", "#5A4E82", "#FF9700", "#EFD81D", "#242424", "#3485DA", "#2E0080", "#517374", "#AAB0C2", "#08608D", "#7377AD", "#F6DD65", "#8193B6", "#E51521", "#491507", "#D73222", "#F76A00", "#2F74C0", "#D9CD00", "#59479B"])

  const selectedLanguages = ['Objective-C', 'Ruby', 'Python'];
  const width = 1000;

  const build = () => {
    const compositeChart = dc.compositeChart(document.querySelector("#series"))

    const lineCharts = selectedLanguages.map(language => (
      dc.lineChart(compositeChart)
        .group(dateDim.group().reduceSum(d => d[language]), language)
        .ordinalColors([languageColorScale(language)])
    ));

    compositeChart.width(width)
      .height(400)
      .margins({ top: 50, right: 50, bottom: 25, left: 30 })
      .dimension(dateDim)
      .x(xScale)
      .xUnits(d3.timeDays)
      .renderHorizontalGridLines(true)
      .legend(dc.legend().x(width - 200).y(5).itemHeight(13).gap(5))
      .brushOn(false)
      .compose(lineCharts)

    dc.renderAll()
  }

  const handleSelectChange = () => {
    build();
  };

  const div = d3.select('#series-boxes')
    .selectAll('input')
    .data(languages).enter()
    .append('div')
    .attr('class', 'form-check form-check-inline')

  div.append('input')
    .attr('type', 'checkbox')
    .attr('class', 'form-check-input')
    .attr('value', d => d)
    .on('change', handleSelectChange)

  div.append('label')
    .attr('class', 'form-check-label')
    .text(d => d)


  build();

})();
