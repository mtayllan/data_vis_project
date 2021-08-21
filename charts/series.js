(async () => {
  const dataset = await popularityDataset;

  const languages = ["Abap", "Ada", "C/C++", "C#", "Cobol", "Dart", "Delphi", "Go", "Groovy", "Haskell", "Java", "JavaScript", "Julia", "Kotlin", "Lua", "Matlab", "Objective-C", "Perl", "PHP", "Python", "R", "Ruby", "Rust", "Scala", "Swift", "TypeScript", "VBA", "Visual Basic"];
  const facts = crossfilter(dataset)
  const dateDim = facts.dimension(d => d.Date)
  const xScale = d3.scaleTime().domain([dateDim.bottom(1)[0].Date, dateDim.top(1)[0].Date])
  const languageColorScale = d3.scaleOrdinal(d3.schemePaired);

  const selectedLanguages = languages.sort(() => Math.random() - Math.random()).slice(0, 3);

  languages.sort();

  const width = 1000;

  const removeLanguage = (lang) => {
    const index = selectedLanguages.indexOf(lang);
    if (index > -1) {
      selectedLanguages.splice(index, 1);
    }
  }

  const build = () => {
    const compositeChart = dc.compositeChart(document.querySelector("#series"))

    const lineCharts = selectedLanguages.map((language, i) => (
      dc.lineChart(compositeChart)
        .group(dateDim.group().reduceSum(d => d[language]), language)
        .ordinalColors([defaultColors[i]])
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

  const handleSelectChange = (selected_lang) => {
    select_box = document.querySelectorAll(`input[type='checkbox'][value='${selected_lang}']`)[0]

    if (select_box.checked == true) {
      if(document.querySelectorAll('input[type="checkbox"]:checked').length > 5) {
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

  const selectInitialLanguages = (languages) => {
    languages.map((lang) => {
      document.querySelectorAll(`input[type='checkbox'][value='${lang}']`)[0].checked = true;
    })
  }

  selectInitialLanguages(selectedLanguages);
  build();

})();
