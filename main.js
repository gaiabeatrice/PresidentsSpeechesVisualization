;(function() {

  var data; // a global
  d3.json("top150.json", function(error, json) {
    if (error) return console.warn(error);
    data = json;
    main();
  });

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);




  function main() {
      var g,
      colorId,
      numNodes = 50,
          contextMenuShowing = false,

      nodes = [],
      width = 2500,
      height = 1500,
      padding = 20,
      minR = 15,
      maxR = 40,
      max = 0,
      min = 1,
      position = "positive";
      scales = {
        x: d3.scale.linear()
                  .domain([0, numNodes]),
                  //.range([((width/12.5)-10)*-1, (width-20)/12.5]),
        colorX: d3.scale.linear()
                  .domain([0, 10]),
                  //.range([((width/12.5)-10)*-1, (width-20)/12.5]),
        y: d3.scale.linear()
                  .domain([0, numNodes]),
                  //questo li espande nel canvas
                  //.range([(height/25)*-1, height/25]),
        r: d3.scale.sqrt()
                  .domain([1, 10])
                  .range([minR, maxR])
      };
  for (var k = 0; k< data.length; k++){
      if(data[k].value.Value > max){
          max= data[k].value.Value;
    }
    if(data[k].value.Value < min){
          min= data[k].value.Value;
    }

    };

  for (i=0; i<data.length; i++) {
     inner_data = [];

    z = (data[i].value.Value - min)/(max - min);
    blueValue = 255 * z;
    redValue = 255 - blueValue;

    for(var j = 0; j < data[i].value.data.length; j++){
      inner_data.push({
        image_url: data[i].value.data[j].Picture,
        president: data[i].value.data[j].President_name,
        party: data[i].value.data[j].Party,
        count: data[i].value.data[j].count
      }
      )
    };

    circle = {
      id: data[i]._id.word,
      r: data[i].value.total/80,
      ratio : data[i].value.Value,
      cx: ((1-data[i].value.Value)/10 * width) - 115,
      cy: scales.y(Math.random()*data.length),
      color: d3.rgb(redValue, 0, blueValue),
      word_data: inner_data
    }

    nodes.push(circle);

  }




  function appear(d){

    if(contextMenuShowing === true){
      popup.remove();
    }

    dataList = [];

      var w = "";
      var totalF = 0;
      var party = "";
      for(var i = 0; i < d.word_data.length; i++){
          totalF = totalF + d.word_data[i].count;
        }

      d.word_data.sort(compare);
      for(var i = 0; i < d.word_data.length; i++){



        if(d.word_data[i].party === "Democratic"){
          color = "blue";
        }else if(d.word_data[i].party === "Republican"){
          color = "red";
        }else if(d.word_data[i].party === "Whig"){
          color = "darkgoldenrod";
        }else if(d.word_data[i].party === "Democratic-Republican"){
          color = "darkgreen";
        }else if(d.word_data[i].party === "Federalist"){
          color = "brown";
        }else {
          color = "purple";
        }

        maxWidth = d.word_data[0].count;
        z = (d.word_data[i].count)/(maxWidth);



        if(d.word_data[i].party === "Democratic-Republican")
          d.word_data[i].party = "Dem-Rep";
          president_url = d.word_data[i].president;
          president_url = president_url.replace(' ', '_');
            //   w = w + "<span style=\"margin-left:2em\"><img src="+ d.word_data[i].image_url +" height=\"100\" > " + d.word_data[i].president + " of " + d.word_data[i].party + " Party <font size=\"6\"> ("+ d.word_data[i].count +" times)</font></span><br/>" + "<svg><rect x=\"100\" y=\"10\" width=\""+ ((d.word_data[i].count) * 2) + "\" height=\"50\" fill=\""+color+"\"></rect><text x=\"180\" y=\"25\" fill=\"white\" font-size=\"15\" text-anchor=\"start\" alignment-baseline=\"central\">"+ d.word_data[i].count +"</text></svg>" + "<br/>";

             // w = w + "<div class=\"president_row\" id="+i+"><span style=\"margin-left:2em\"><img src="+ d.word_data[i].image_url +" height=\"100\" > " + d.word_data[i].president + " of " + d.word_data[i].party + " Party <font size=\"6\"> ("+ d.word_data[i].count +" times)</font></span><br/>"+ "<br/></div>";
              w = w +"<span style=\"margin-left:2em\"><img src="+ d.word_data[i].image_url +" height=\"100\" > <a target=\"_blank\" title=\"Wikipedia page of "+ d.word_data[i].president +"\"href=\"https://en.wikipedia.org/wiki/"+president_url+"\">" + d.word_data[i].president + "</a> of " + d.word_data[i].party + " Party</span><div align=\"left\" class=\"stroke\" style=\"width:" + (z * 900) + "px;height:100px; margin-left:100px; background-color:"+ color +"; color:white; \">"+ d.word_data[i].count +"<font size=\"5\"></font></div><br/>";
                dataList.push(d.word_data[i].count);
      }




      contextMenuShowing = true;
        popup = d3.select("#canvas")
            .append("div")
            .attr("class", "popup")
            .style("left", "108px")
            .style("top", "108px")
            .on("click", function() {
             popup.remove();
                   contextMenuShowing = false;

        //         .duration(500)
        //         .style("opacity", 0);
        //         contextMenuShowing = false;
        //                 console.log(contextMenuShowing);

         })
        popup.append("h2").html("<center><u>"+ d.id + "</u></center>");
        popup.append("div").html(
            "<center>The word <i>" + d.id + "</i> was told by</center><br/>" + w + '<center>TOTAL ' + totalF + " TIMES</center>" );
        // popup.append("p").text(
        //     "The word " + d.id + " told by:");
        // popup.append("div").html(
        //     w);
        // popup.append("").text(
        //   "TOTAL " + data[i].value.total + " TIMES"
        //   );

      /*  var x = d3.scale.linear()
          .domain([0, d3.max(dataList)])
          .range([0, 420]);

        d3.selectAll(".president_row")
          .selectAll(".chart")
          .data(dataList)
        .enter().append("div")
          .style("width", function(d) { return x(d) + "px"; })
          .text(function(d) { return d; });*/



  }




     function mouseover(){
        div.transition()
          .duration(200)
          .style("opacity", .9);
      }
      //Add the data you want to display to the tooltip. The province that is hovered and the number of arrests in that province.
        //Position the left side of the tooltip at the same left offset as the mouse cursor,
        //Position the tooltip 50px above the cursor
      function mousemove(d){
          div .html(d.id  + "<br/><font size='6'>Time: </font><font size='7'>" + (d.r * 80) + "</font><br/><font size='6'>Rep Percentage: </font><br/><font size='7'>" + (100 - (Math.ceil(d.ratio * 100))) + "%</font>"+"<br/><font size='6'>Dem Percentage: </font><br/><font size='7'>" + Math.ceil(d.ratio * 100) + "%</font>")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 50) + "px");
      }
      //Hide the tooltip whit CSS transition when you are no longer hover over it
      function mouseout(){
          div.transition()
            .duration(500)
            .style("opacity", 0);
      }


  var svg = d3.select("#canvas").append("svg")
                .attr({
                  width: width,
                  height: height,
                  align: 'center'
                })
                .style({
                  background: 'black'
                }),

      force = d3.layout.force()
                    .nodes(nodes)
                    .links([])
                    .size([width, height])
                    .charge(function(d) {
                      return -1 * (Math.pow(d.r * 5.0, 2.0) / 8);
                    })
                    .gravity(2.75)
                    .on("tick", tick);

  function update(nodes) {
    g = svg.selectAll("g.node")
              .data(nodes, function(d, i) {
                return d.id;
              });

    g.enter().append("g")
                .attr({
                  "class": "node"
                });

    if (g.selectAll("circle").empty()) {
      circle = g.append("circle")
                  .attr({
                    r: function(d) {
                      return d.r;
                    },
                    id: function(d) {
                      return d.id;
                    }
                  })
                  .style({
                    fill: function(d) {
                      return d.color;
                    }
                  })
                  .on("click", function(d){
                    appear(d);
                    mouseout();
                  })
                  .on("mouseover", mouseover)
                  .on("mousemove", mousemove)
                  .on("mouseout", mouseout);

      label = g.append("text")
                  .attr({
                    x: 0,
                    y: 3,
                    id: function(d) {
                      return d.id + "_text";
                    }
                  })
                  .style('fill', 'white')
                  .style("font-size","24px")
                  .text(function(d) {
                    if(d.r > 20 || d.id.length < 6 || d.id === 'commission' || d.id ==='mexico')
                    return d.id;
                  })
                  .on("click", function(d){
                    appear(d);
                    mouseout();
                  })
                  .on("mouseover", mouseover)
                  .on("mousemove", mousemove)
                  .on("mouseout", mouseout);


    } else {
      circle.transition()
          .duration(1000)
          .attr({
            r: function(d) {
              return d.r;
            }
          })
    }

    g.exit().remove();

    svg.append("text")
    .attr("x", 100)
    .attr("y", height/2)
    .attr("id", "dem")
    .attr("font-size", 5000)
    .attr("style", "fill: blue; writing-mode: tb; glyph-orientation-vertical: 0")
    .text("Democratics");
    svg.append("text")
    .attr("x", width-100)
    .attr("y", height/2)
    .attr("id", "rep")
    .attr("font-size", 5000)
    .attr("style", "fill: red; writing-mode: tb; glyph-orientation-vertical: 0")
    .text("Republicans");

     svg.append("svg:image")
     .attr("x", width-400)
     .attr("y", ((height/3)*2) + 150)
     .attr('width', 200)
     .attr('height', 240)
     .attr("id", "dem")
     .attr("xlink:href","https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Republicanlogo.svg/1179px-Republicanlogo.svg.png")

  svg.append("svg:image")
     .attr("x", 150)
     .attr("y", ((height/3)*2) +150)
     .attr('width', 200)
     .attr('height', 240)
     .attr("id", "rep")
     .attr("xlink:href","http://vignette2.wikia.nocookie.net/residentevil/images/7/70/Democratic-donkey.png/revision/latest?cb=20120324002027")





    force.nodes(nodes).start();
  }

  // Adapted from http://bl.ocks.org/3116713
  function collide(alpha, nodes) {
    quadtree = d3.geom.quadtree(nodes);
    return function(d) {
      r = d.r + padding
      nx1 = d.x - r;
      nx2 = d.x + r;
      ny1 = d.y - r;
      ny2 = d.y + r;
      return quadtree.visit(function(quad, x1, y1, x2, y2) {
        var l, x, y;
        if (quad.point && quad.point !== d) {
          x = d.x - quad.point.x;
          y = d.y - quad.point.y;
          l = Math.sqrt(x * x + y * y);
          r = d.r + quad.point.r + padding;
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  };

  function compare(a, b){
    if(a.count < b.count)
      return 1;
    if(a.count > b.count)
      return -1;
    return 0;
  }

  // See https://github.com/mbostock/d3/wiki/Force-Layout
  function tick(e) {
    k = 39 * e.alpha;
    nodes.forEach(function(d, i) {
      d.x += k * d.cx;
      d.y += k * d.cy;
    });

    g.each(collide(.1, nodes))
      .attr({
        transform: function(d, i) {
          return "translate(" + d.x + "," + d.y + ")";
        }
      });
  };

  update(nodes);

}}());
