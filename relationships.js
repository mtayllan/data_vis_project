const relationships = () => {
  const ready = ([links2]) => {
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    const factsLinks = crossfilter(links2);

    const targetsDim = factsLinks.dimension(d => d.target);
    const targetsDimGroup = targetsDim.group();

    const sources = links2.map(link => link.source).filter(onlyUnique)

    function possibleTargets(source) {
      let final_arr = []
      links2.sort((a, b) => (a.value > b.value) ? -1 : 1)
      links2.map(function (link) {
        if (link.source == source) {
          final_arr.push(link.target)
        }
      })

      return final_arr
    }

    const buildbar = () => {
      let selected = d3.select("#selected-dropdown select").node().value;
      let view = document.querySelector('.container')
      let barChart = dc.barChart(view.querySelector("#relationships"))
      let language = d3.select("#selected-dropdown select").node().value
      let posTargets = possibleTargets(language)

      const width = 1000;

      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

      barChart.width(width) // variável padrão do obs, pega larguda da célula
        .height(500)
        .dimension(targetsDim)
        .margins({ top: 30, right: 50, bottom: 25, left: 40 })
        .x(d3.scaleOrdinal().domain(posTargets.slice([0, 15])))
        .xUnits(dc.units.ordinal)
        .colors(colorScale)
        .colorAccessor(d => d.key)
        .renderHorizontalGridLines(true)
        .legend(dc.legend().x(width - 250).y(10).itemHeight(13).gap(5))
        .brushOn(false)
        .group(
          targetsDimGroup.reduceSum(function (link) {
            if (link.source == language) {
              return link.value
            } else {
              return 0
            }
          }), `Relação de ${language} com outras linguagens`
        )
        .addFilterHandler((_, filter) => {
          setHightlighted(filter);
          buildnet();
          return [filter];
        })
        .removeFilterHandler(() => { setHightlighted(''); buildnet(); return []; })
      //.ordinalColors(['steelblue'])

      dc.renderAll()
      return view
    }


    var select = d3.select('#selected-dropdown')
    .append('select')
    	.attr('class','select')
      .on('change',onchange)

    var options = select
      .selectAll('option')
      .data(sources).enter()
      .append('option')
      .text(function (d) { return d; });

    function onchange() {
      let selectValue = d3.select('select').property('value')
      d3.select('body')
        .append('p')
        .text(selectValue + ' is the last selected option.')
    };

    d3.select("select").on('change', buildbar);


    buildbar();
  }

  const promisses = [
    d3.csv('./stack_network_links.csv', item => ({ ...item, value: +item.value })),
  ]

  Promise.all(promisses).then(ready);
};

relationships();
