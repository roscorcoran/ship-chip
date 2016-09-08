import Ember from 'ember';
import d3 from 'd3';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['ship-deck'],
  //attributeBindings: ['width', 'height'],
  //width: '100%',
  //height: '1000px',
  elementId: 'ship-deck',
  deck: {

    // 9'/50' = 0.18
    boundary: {width: 1800, height: 1800*0.18}
  },

  draw: function (w, h) {
    var page = {
      width: parseInt(w),
      height: parseInt(h)
    };
    var data = this.get('data');
    var boundary = this.get('deck.boundary');

    var svg = d3.select('#' + this.get('elementId'))
      .append('svg')
      .attr('class', 'workspace')
      .attr('width', page.width)
      .attr('height', page.height)
      .append('g')
      .attr('transform', 'scale(1)')
      .call(d3.zoom()
        .scaleExtent([0.2, 4])
        .on('zoom', zoomed));

    $(document).keydown(function (e) {
      if (e.keyCode == 18) {
        svg.attr('class', 'workspace modifier');
      }
    });
    $(document).keyup(function (e) {
      if (e.keyCode == 18) {
        svg.attr('class', 'workspace');
      }
    });

    svg.append('rect')
      .attr('width', page.width)
      .attr('height', page.height)
      .style('fill', 'none')
      .style('pointer-events', 'all');

    var zoomContainer = svg.append('g');

    //deck is always center
    var deck = zoomContainer.append('g')
      .attr('transform', 'translate(' + (page.width-boundary.width)/2 + ',' + (page.height-boundary.height)/2 + ')');

    //Draw the grid via lines
    var linespace = boundary.height/63;
    deck.append('g')
      .attr('class', 'x axis')
      .selectAll('line')
      .data(d3.range(0, boundary.width, linespace))
      .enter().append('line')
      .attr('x1', function (d) { return d; })
      .attr('y1', 0)
      .attr('x2', function (d) { return d; })
      .attr('y2', boundary.height);

    deck.append('g')
      .attr('class', 'y axis')
      .selectAll('line')
      .data(d3.range(0, boundary.height, linespace))
      .enter().append('line')
      .attr('x1', 0)
      .attr('y1', function (d) { return d; })
      .attr('x2', boundary.width)
      .attr('y2', function (d) { return d; });


    //Append all the control items
    deck.append('g')
      .attr('class', 'dot')
      .selectAll('circle')
      .data(data)
      .enter().append('circle')
      .attr('r', linespace*4)
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; })
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    deck.append('rect')
      .attr('class', 'boundary')
      .attr('width', boundary.width)
      .attr('height', boundary.height);


    function zoomed() {
      zoomContainer.attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ')scale(' + d3.event.transform.k + ')');
    }

    function dragstarted() {
      d3.event.sourceEvent.stopPropagation();
      d3.select(this).classed('dragging', true);
    }

    function dragged(d) {
      d3.select(this).attr('cx', d.x = d3.event.x).attr('cy', d.y = d3.event.y);
    }

    function dragended() {
      d3.select(this).classed('dragging', false);
    }
  },

  didInsertElement: function () {
    var w = this.$().css('width');
    var h = this.$().css('height');

    this.draw(w, h);
  }
});
