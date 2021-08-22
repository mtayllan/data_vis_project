(async () => {
  const dataset = await popularityDataset;

  const languages = ["Abap", "Ada", "C/C++", "C#", "Cobol", "Dart", "Delphi", "Go", "Groovy", "Haskell", "Java", "JavaScript", "Julia", "Kotlin", "Lua", "Matlab", "Objective-C", "Perl", "PHP", "Python", "R", "Ruby", "Rust", "Scala", "Swift", "TypeScript", "VBA", "Visual Basic"];
  const facts = crossfilter(dataset)
  const dateDim = facts.dimension(d => d.Date)
  const xScale = d3.scaleTime().domain([dateDim.bottom(1)[0].Date, dateDim.top(1)[0].Date])

  const selectedLanguages = languages.sort(() => Math.random() - Math.random()).slice(0, 3);

  languages.sort();

  const removeLanguage = (lang) => {
    const index = selectedLanguages.indexOf(lang);
    if (index > -1) {
      selectedLanguages.splice(index, 1);
    }
  }

  const compositeChart = dc.compositeChart(document.querySelector("#series"));
  const dateRangeChart = dc.barChart(document.querySelector("#date-range-selector"));
  compositeChart.width(990)
    .height(400)
    .margins({ top: 50, right: 50, bottom: 50, left: 40 })
    .dimension(dateDim)
    .x(xScale)
    .xUnits(d3.timeDays)
    .y(d3.scaleLinear().domain([0, 33]))
    .yAxisLabel('% de Popularidade')
    .xAxisLabel('Tempo')
    .renderHorizontalGridLines(true)
    .legend(dc.legend().x(990 - 100).y(5).itemHeight(13).gap(5))
    .brushOn(false)
    .rangeChart(dateRangeChart)
    .compose([]);

  dateRangeChart.width(990)
    .height(40)
    .margins({ top: 0, right: 50, bottom: 20, left: 40 })
    .dimension(dateDim)
    .group(dateDim.group().reduceSum(d => d['Ruby']))
    .centerBar(true)
    .gap(1)
    .x(d3.scaleTime().domain([new Date(2004, 0, 1), new Date(2021, 5, 31)]))
    .alwaysUseRounding(true)
    .xUnits(d3.timeDays);

  const build = () => {
    const tops = [];
    const lineCharts = selectedLanguages.map((language, i) => {
      const group = dateDim.group().reduceSum(d => d[language]);
      tops.push(group.top(1)[0].value);
      return dc.lineChart(compositeChart)
        .group(group, language)
        .ordinalColors([defaultColors[i]])
    });

    const topsSorted = tops.sort((a, b) => b - a);

    compositeChart
      .y(d3.scaleLinear().domain([0, topsSorted[0]]))
      .compose(lineCharts)

    dc.renderAll()
  }

  const handleSelectChange = (selected_lang) => {
    select_box = document.querySelectorAll(`input[type='checkbox'][value='${selected_lang}']`)[0]

    if (select_box.checked == true) {
      if (document.querySelectorAll('input[type="checkbox"]:checked').length > 5) {
        alert('Você só pode selecionar até 5 linguagens!')
        select_box.checked = false
      } else {
        selectedLanguages.push(selected_lang)
      }
    } else {
      removeLanguage(selected_lang)
    }

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

  selectedLanguages.map((lang) => {
    document.querySelectorAll(`input[type='checkbox'][value='${lang}']`)[0].checked = true;
  })

  build();

})();
