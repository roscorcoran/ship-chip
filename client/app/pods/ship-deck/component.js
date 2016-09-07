import Ember from 'ember';
import d3 from 'd3';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['ship-deck'],
  //attributeBindings: ['width', 'height'],
  //width: '100%',
  //height: '1000px',
  elementId: 'ship-deck',
  margin: {top: 0, right: 0, bottom: 0, left: 0},

  draw: function (w, h) {
    var width = parseInt(w);
    var height = parseInt(h);
    var margin = this.get('margin');
    var data = this.get('data');

    var zoom = d3.zoom()
      .scaleExtent([0.2, 4])
      .on("zoom", zoomed);

    var drag = d3.drag()
      //.origin(function (d) { return d; })
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    var svg = d3.select('#' + this.get('elementId'))
      .append('svg')
      .attr("width", width * 2 + margin.left + margin.right)
      .attr("height", height * 2 + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(-" + width / 2 + ",-" + height / 2 + ")")
      .call(zoom);

    svg.append("rect")
      .attr("width", width * 2)
      .attr("height", height * 2)
      .style("fill", "none")
      .style("pointer-events", "all");

    var zoomContainer = svg.append("g");

    var controlContainer = svg.append("g");

    var linespace = 10;

    zoomContainer.append("g")
      .attr("class", "x axis")
      .selectAll("line")
      .data(d3.range(0, width * 2, linespace))
      .enter().append("line")
      .attr("x1", function (d) { return d; })
      .attr("y1", 0)
      .attr("x2", function (d) { return d; })
      .attr("y2", height * 2);

    zoomContainer.append("g")
      .attr("class", "y axis")
      .selectAll("line")
      .data(d3.range(0, height * 2, linespace))
      .enter().append("line")
      .attr("x1", 0)
      .attr("y1", function (d) { return d; })
      .attr("x2", width * 2)
      .attr("y2", function (d) { return d; });

    zoomContainer.append("g")
      .attr("class", "dot")
      .selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("r", linespace)
      .attr("cx", function (d) { return d.x; })
      .attr("cy", function (d) { return d.y; })
      .call(drag);


    function zoomed() {
      zoomContainer.attr("transform", "translate(" + d3.event.transform.x + ',' + d3.event.transform.y + ")scale(" + d3.event.transform.k + ")");
    }

    function dragstarted() {
      d3.event.sourceEvent.stopPropagation();
      d3.select(this).classed("dragging", true);
    }

    function dragged(d) {
      d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    }

    function dragended() {
      d3.select(this).classed("dragging", false);
    }
  },

  didInsertElement: function () {
    var w = this.$().css('width');
    var h = this.$().css('height');

    this.draw(w, h);
  }
});
