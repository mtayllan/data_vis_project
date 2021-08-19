const history = () => {
  const ready = ([dataset]) => {
    const facts = crossfilter(dataset)
    const dateDim = facts.dimension(d => d.Date)
    const languages = dataset.columns.slice(2, 30)
    const xScale = d3.scaleTime().domain([dateDim.bottom(1)[0].Date, dateDim.top(1)[0].Date])
    const randomSelected = languages.sort(() => Math.random() - Math.random()).slice(0, 3)
    const languageColorScale = d3.scaleOrdinal()
      .domain(["Abap", "Ada", "C/C++", "C#", "Cobol", "Dart", "Delphi", "Go", "Groovy", "Haskell", "Java", "JavaScript", "Julia", "Kotlin", "Lua", "Matlab", "Objective-C", "Perl", "PHP", "Python", "R", "Ruby", "Rust", "Scala", "Swift", "TypeScript", "VBA", "Visual Basic"])
      .range(["#00A1EA", "#14127B", "#A8B9CC", "#9B6CD7", "#2ADF32", "#04599C", "#E7273A", "#00ABD8", "#569ABD", "#5A4E82", "#FF9700", "#EFD81D", "#242424", "#3485DA", "#2E0080", "#517374", "#AAB0C2", "#08608D", "#7377AD", "#F6DD65", "#8193B6", "#E51521", "#491507", "#D73222", "#F76A00", "#2F74C0", "#D9CD00", "#59479B"])

    const language_popularities = dataset.columns.slice(2).map(function(col) {
      return {
        id: col,
        values: dataset.map(function(d) {
          return {date: d.Date, popularity: d[col]};
        })
      };
    });

    const selectedLanguages = ['Java', 'Ruby', 'Python'];
    const width = 1000;

    const buildbar = () => {
      let compositeChart = dc.compositeChart(document.querySelector("#history"))
      let teste = selectedLanguages.map(function(col) {
          return dc.lineChart(compositeChart)
                          .group(dateDim.group().reduceSum(d => d[`${col}`]), `${col}`)
                          .ordinalColors([languageColorScale(`${col}`)])
      })


        compositeChart.width(width)
                  .height(400)
                  .margins({top: 50, right: 50, bottom: 25, left: 10})
                  .dimension(dateDim)
                  .x(xScale)
                  .xUnits(d3.timeDays)
                  .y(d3.scaleLinear().domain([0, 1]))
                  .renderHorizontalGridLines(true)
                  .legend(dc.legend().x(width-200).y(5).itemHeight(13).gap(5))
                  .brushOn(false)
                  .compose(teste)


      dc.renderAll()
    }

    buildbar();
  };

  const promisses = [
    d3.csv('programming_languages_popularity.csv').then(data => {
      let dateParser = d3.utcParse('%B %e, %Y');
      let format = d3.format(',');
      data.forEach(item => {
        item.Date = item.Date;
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
  ]

  Promise.all(promisses).then(ready);
};

history();
