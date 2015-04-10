var margin = {top: 20, right: 80, bottom: 30, left: 80},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    legendWidth = 245,
    scatterWidth = width - legendWidth;

var x = d3.scale.linear()
    .range([0, scatterWidth]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category20b();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

function loadComboBox(el, columns, selected, onChange) {
  var select = d3.select(el).append("div")
    .append("select")
      .on("change", onChange);

  select.selectAll("option")
    .data(columns)
    .enter().append("option")
      .attr("value", function (d) { return d; })
      .text(function (d) { return d; });
      
  select.property("value", selected);
};    
    
var svg = d3.select('#scatterplot').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
var scatterplot = svg.append("g")
    .attr("class", "scatterplot");

svg.append("g")
    .attr("class", "legendg")
    .attr("transform", "translate(" + scatterWidth + ",0)")    

/* Initialize tooltip */
tip = d3.tip().attr('class', 'd3-tip').html(function(d) { 
  return [d[col_key], d[col_color]].join([separator = ", "]);  
});

/* Invoke the tip in the context of your visualization */
svg.call(tip)
    
var columnAPI = "https://www.apitite.net/api/clean_web/scatter-cols/json";
var dataAPI = "https://www.apitite.net/api/clean_web/scatter-data/json?"

var col_x = "site_energy_use"
  , col_y = "natural_gas_use"
  , col_color = "primary_property_type"
  , col_key = "property_name";

var columns;
  
d3.json(columnAPI, function(error, json){
  if (error) return console.warn(error);
  columns = Object.keys(json[0]);

  loadComboBox('#select-x', columns, col_y, function(){ col_y = this.value; loadScatterData(); });  
  loadComboBox('#select-y', columns, col_x, function(){ col_x = this.value; loadScatterData(); });
  
  if(columns.indexOf(col_x) > 0 && columns.indexOf(col_y) > 0){
    loadScatterData();
  };  
});

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

scatterplot.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .append("text")
    .attr("class", "label x")
    .attr("x", scatterWidth)
    .attr("y", -6)
    .style("text-anchor", "end");

scatterplot.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("class", "label y")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end");        
        
function loadScatterData(){
  d3.json(dataAPI + $.param({ col_x: col_x, col_y: col_y}), function(error, json){
    if (error) return console.warn(error);
    console.dir(json);
    data = json;

    x.domain(d3.extent(data, function(d) { return d.x; })).nice();
    y.domain(d3.extent(data, function(d) { return d.y; })).nice();

    d3.select(".label.x").text(col_x);
    d3.select(".label.y").text(col_y);
      
    var dots = scatterplot.selectAll(".dot")
        .data(data, function(d){ return d[col_key]})

    // enter-update-exit pattern
    var enter = dots.enter()
      , update = dots
      , exit = dots.exit();
    
    // Transition chaining
    var t = d3.transition().duration(750);
    
    // Operate on new elements only
    var circles = enter.append("circle")
        .attr("class", "dot")
        .attr("r", 4)
        .attr("cx", 0)
        .attr("cy", height)
        .style("fill", function(d) { return color(d[col_color]); })
        .style("opacity", 0)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
    
    // 1. exit -- Operate on old elements only
    if(!exit.empty()){
      t = t.transition().each(function() {
        exit
          .transition()
            .style("opacity", 0)
            .remove();
      });
    };
    
    // 2. update -- Operate on old and new elements
    if(!update.empty()){
      t = t.transition().each(function() {
        dots
          .transition()
            .attr("cx", function(d) {
                return x(d.x); 
             })
            .attr("cy", function(d) { return y(d.y); })
            
        svgt = svg.transition();
        
        svgt.select(".x.axis") // change the x axis
          .duration(750)
          .call(xAxis);
        
        svgt.select(".y.axis") // change the y axis
          .duration(750)
          .call(yAxis);
      });
    };
        
    // 3. enter -- Operate on new elements only
    if(!enter.empty()){
      t = t.transition().each(function() {
        circles
          .transition()
            .style("opacity", 1)
      });
    };
    
    var legend = svg.select(".legendg").selectAll(".legend")
        .data(color.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", legendWidth - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", legendWidth - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
  });
};