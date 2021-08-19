const map = () => {
  const ready = ([world, datasetTopLanguage, countryIds]) => {
    const nameById = (id) => countryIds.find(country => country.id === id)?.Country;


    const width = 1000;
    const height = 400;

    const buildmap = () => {
      const svg = d3.select('#map').append('svg').attr('width', width).attr('height', height)
      let path = d3.geoPath(d3.geoMercator().scale(100))

      svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter().append("path")
        .attr("fill", d => languageColors(d.id))
        .attr("d", path)
        .on("mouseover", function (d) {
          d3.select(this) // seleciona o elemento atual
            .style("cursor", "pointer") //muda o mouse para mãozinha
            .attr("stroke-width", 3)
            .attr("stroke", "#000000");
          const mouse = d3.mouse(this);
          showTooltip(d.id, mouse[0] + 20, mouse[1]);
        })
        .on("mouseout", function (d) {
          d3.select(this)
            .style("cursor", "default")
            .attr("stroke-width", 0)
            .attr("stroke", "none"); //volta ao valor padrão
          hideTooltip();
        })
    }

    function languageColors(CountryId) {

      const nameCountry = nameById(CountryId);
      const languageName = datasetTopLanguage[nameCountry];
      const colors = {
        "JavaScript": "yellow",
        "HTML/CSS": "red",
        "C": "blue",
        "C#": "green",
        "Python": "pink",
        "SQL": "brown",
        "Java": "magenta",
        "Bash/Shell/PowerShell": "cyan",
        "TypeScript": "gray",
        "PHP": "lime",
        "VBA": "Bisque",
        "Swift": "Aqua",
        "Assembly": "golden"
      }
      return colors[languageName] || "black";
    }

    function showTooltip(country_id, x, y) {
      const nameCountry = nameById(country_id);
      const languageName = datasetTopLanguage[nameCountry];
      const offset = 10;
      const t = d3.select("#tooltip");
      t.select("#taxa").text(languageName);
      t.select("#countryname").text(nameCountry);
      t.classed("hidden", false);
      const rect = t.node().getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (x + offset + w > width) {
        x = x - w;
      }
      //t.style("left", x + offset + "px").style("top", y - h + "px");
      t.style("left", x + "px").style("top", y + "px");
    }

    d3.select("#tooltip").remove()
    d3.select("#map")
      .append("div")
      .attr("id", "tooltip")
      .attr("class", "hidden")
      .append("p")
      .html("<b><span id='countryname'></span></b><br>Top Language: <span id='taxa'></span>")

    function hideTooltip() {
      d3.select("#tooltip")
        .classed("hidden", true)
    }

    buildmap();
  };

  const promisses = [
    d3.json('countries-50m.json'),
    d3.json('country_lang_top.json'),
    d3.csv('country_id.csv')
  ];

  Promise.all(promisses).then(ready);
};

map();
