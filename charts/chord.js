(async () => {
  let matrix = await matrixDataset;

  // generate the matrix from csv
  matrix = d3.csvParseRows(matrix).map(i => i.map(j => parseInt(j)));

  const margin = { left: 20, top: 20, right: 20, bottom: 20 };
  const width = Math.min(window.innerWidth, 700) - margin.left - margin.right;
  const height = Math.min(window.innerWidth, 700) - margin.top - margin.bottom;
  const innerRadius = Math.min(width, height) * .39;
  const outerRadius = innerRadius * 1.1;

  const LANGUAGE_NAMES = ["JavaScript", "HTML/CSS", "SQL", "Python", "Java", "C#", "PHP", "TypeScript", "C++", "C", "Go", "Kotlin"]
  let colors = defaultColors;
  const defaultOpacity = 0.8;

  ////////////////////////////////////////////////////////////
  /////////// Create scale and layout functions //////////////
  ////////////////////////////////////////////////////////////

  colors = d3.scaleOrdinal()
    .domain(d3.range(LANGUAGE_NAMES.length))
    .range(colors);

  const chord = d3.chord()
    .padAngle(.15)
    .sortSubgroups(d3.descending)(matrix);

  const arc = d3.arc()
    .innerRadius(innerRadius * 1.01)
    .outerRadius(outerRadius);

  const path = d3.ribbon().radius(innerRadius);

  ////////////////////////////////////////////////////////////
  ////////////////////// Create SVG //////////////////////////
  ////////////////////////////////////////////////////////////

  const svg = d3.select("#chord").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${(width / 2 + margin.left)},${(height / 2 + margin.top)})`);

  ////////////////////////////////////////////////////////////
  /////////////// Create the gradient fills //////////////////
  ////////////////////////////////////////////////////////////

  // Function to create the id for each chord gradient
  const getGradID = (d) => `linkGrad-${d.source.index}-${d.target.index}`

  //Create the gradients definitions for each chord
  const grads = svg.append("defs").selectAll("linearGradient")
    .data(chord)
    .enter().append("linearGradient")
    .attr("id", getGradID)
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", d => innerRadius * Math.cos((d.source.endAngle - d.source.startAngle) / 2 + d.source.startAngle - Math.PI / 2))
    .attr("y1", d => innerRadius * Math.sin((d.source.endAngle - d.source.startAngle) / 2 + d.source.startAngle - Math.PI / 2))
    .attr("x2", d => innerRadius * Math.cos((d.target.endAngle - d.target.startAngle) / 2 + d.target.startAngle - Math.PI / 2))
    .attr("y2", d => innerRadius * Math.sin((d.target.endAngle - d.target.startAngle) / 2 + d.target.startAngle - Math.PI / 2))

  //Set the starting color (at 0%)
  grads.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", d => colors(d.source.index));

  //Set the ending color (at 100%)
  grads.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", d => colors(d.target.index));

  ////////////////////////////////////////////////////////////
  ////////////////// Draw outer Arcs /////////////////////////
  ////////////////////////////////////////////////////////////

  const outerArcs = svg.selectAll("g.group")
    .data(chord.groups)
    .enter().append("g")
    .attr("class", "group")
    .on("mouseover", fade(.1))
    .on("mouseout", fade(defaultOpacity));

  outerArcs.append("path")
    .style("fill", d => colors(d.index))
    .attr("d", arc)
    .each(function (d, i) {
      //Search pattern for everything between the start and the first capital L
      const firstArcSectionRgx = /(^.+?)L/;

      //Grab everything up to the first Line statement
      let newArc = firstArcSectionRgx
        .exec(d3.select(this).attr("d"))[1]
        .replace(/,/g, " ");

      //If the end angle lies beyond a quarter of a circle (90 degrees or pi/2)
      //flip the end and start position
      if (d.endAngle > 90 * Math.PI / 180 & d.startAngle < 270 * Math.PI / 180) {
        const startLoc = /M(.*?)A/,  //Everything between the first capital M and first capital A
          middleLoc = /A(.*?)0 0 1/, //Everything between the first capital A and 0 0 1
          endLoc = /0 0 1 (.*?)$/;   //Everything between the first 0 0 1 and the end of the string (denoted by $)
        //Flip the direction of the arc by switching the start en end point (and sweep flag)
        //of those elements that are below the horizontal line
        const newStart = endLoc.exec(newArc)[1];
        const newEnd = startLoc.exec(newArc)[1];
        const middleSec = middleLoc.exec(newArc)[1];

        //Build up the new arc notation, set the sweep-flag to 0
        newArc = `M${newStart}A${middleSec}0 0 0 ${newEnd}`;
      }//if

      //Create a new invisible arc that the text can flow along
      svg.append("path")
        .attr("class", "hiddenArcs")
        .attr("id", "arc" + i)
        .attr("d", newArc)
        .style("fill", "none");
    });

  ////////////////////////////////////////////////////////////
  ////////////////// Append LANGUAGE_NAMES ////////////////////////////
  ////////////////////////////////////////////////////////////

  //Append the label names on the outside
  outerArcs.append("text")
    .attr("class", "titles")
    .attr("dy", d => (d.endAngle > 90 * Math.PI / 180 & d.startAngle < 270 * Math.PI / 180 ? 25 : -16))
    .append("textPath")
    .attr("startOffset", "50%")
    .style("text-anchor", "middle")
    .attr("xlink:href", (_, i) => `#arc${i}`)
    .text((_, i) => LANGUAGE_NAMES[i]);

  ////////////////////////////////////////////////////////////
  ////////////////// Draw inner chords ///////////////////////
  ////////////////////////////////////////////////////////////

  svg.selectAll("path.chord")
    .data(chord)
    .enter().append("path")
    .attr("class", "chord")
    .style("fill", d => `url(#${getGradID(d)})`)
    .style("opacity", defaultOpacity)
    .attr("d", path)
    .on("mouseover", mouseoverChord)
    .on("mouseout", mouseoutChord);

  ////////////////////////////////////////////////////////////
  ////////////////// Extra Functions /////////////////////////
  ////////////////////////////////////////////////////////////

  //Returns an event handler for fading a given chord group.
  function fade(opacity) {
    return (_, i) => {
      svg.selectAll("path.chord")
        .filter((d) => d.source.index !== i && d.target.index !== i)
        .transition()
        .style("opacity", opacity);
    }
  }

  //Highlight hovered over chord
  function mouseoverChord(d) {
    //Decrease opacity to all
    svg.selectAll("path.chord")
      .transition()
      .style("opacity", 0.1);
    //Show hovered over chord with full opacity
    d3.select(this)
      .transition()
      .style("opacity", 1);

    const popover = new bootstrap.Popover(this, {
      placement: 'auto',
      container: 'body',
      trigger: 'hover',
      html: true,
      content: () => `
        <p>
          <b>${d.source.value}</b> que trabalham com ${LANGUAGE_NAMES[d.source.index]} querem trabalhar com ${LANGUAGE_NAMES[d.target.index]}
          </br>
          <b>${d.target.value}</b> que trabalham com ${LANGUAGE_NAMES[d.target.index]} querem trabalhar com ${LANGUAGE_NAMES[d.source.index]}
        </p>
      `
    })
    popover.show();
  }

  //Bring all chords back to default opacity
  function mouseoutChord(d) {
    //Hide the tooltip
    bootstrap.Popover.getInstance(this).hide();
    //Set opacity back to default for all
    svg.selectAll("path.chord")
      .transition()
      .style("opacity", defaultOpacity);
  }
})();
