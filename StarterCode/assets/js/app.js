// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 700;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 40,
  bottom: 60,
  left: 100
};

var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

d3.csv("assets/data/data.csv").then(function(healthcareData) {
    console.log(healthcareData);

    healthcareData.forEach(function(d) {
        d.poverty = +d.poverty;
        d.povertyMoe = +d.povertyMoe;
        d.age = +d.age;
        d.income = +d.income;
        d.healthcare = +d.healthcare;
        d.healthcareLow = +d.healthcareLow;
        d.healthcareHigh = +d.healthcareHigh;
        d.obesity = +d.obesity;
        d.obesityLow = +d.obesityLow;
        d.obesityHigh = +d.obesityHigh;
        d.smokes = +d.smokes;
        d.smokesLow = +d.smokesLow;
        d.smokesHigh = +d.smokesHigh;
    });

    var xLinearScale = d3.scaleLinear()
        .domain([6, d3.max(healthcareData, d => d.poverty + 2)])
        .range([0, chartWidth]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([2, d3.max(healthcareData, d => d.healthcareLow + 2)])
        .range([chartHeight, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);
    
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthcareData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcareLow))
        .attr("r", "10")
        .attr("fill", "blue")
        .attr("opacity", ".5");

    chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .selectAll("tspan")
        .data(healthcareData)
        .enter()
        .append("tspan")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcareLow))
        .text(function(data) {
            return data.abbr
        });
        
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return(`${d.abbr}<br>Poverty Rate: ${d.poverty}%<br>Percentage of People With Healthcare: ${d.healthcare}`);
        });
    
    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 40)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");
    
    chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 30})`)
    .attr("class", "axisText")
    .text("Poverty Rate (%)");

});