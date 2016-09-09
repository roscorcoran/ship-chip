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
    // 9'/(50'-8-6) = 0.25
    boundary: {width: 1600, height: 1600 * 0.25}
  },
  keyDown: function (e) {
    //Alt key sets edit mode
    if (e.keyCode === 18) {
      this.enableEditMode();
    }
  },
  //Alt key sets edit mode
  keyUp: function (e) {
    if (e.keyCode === 18) {
      this.disableEditMode();
    }
  },
  isEditing: false,
  enableEditMode: function () {
    this.isEditing = true;
    this.$().addClass('modifier');
  },
  disableEditMode: function () {
    this.isEditing = false;
    this.$().removeClass('modifier');
  },
  updateButton: function (k, v) {
    var button = this.get('buttons.' + k);
    button.value = v.value;
    button.ui.x = v.ui.x;
    button.ui.y = v.ui.y;

    var ship = this.get('ship');
    ship.save();
  },

  draw: function (w, h) {
    var page = {
      width: parseInt(w),
      height: parseInt(h)
    };
    var ship = this.get('ship');
    var buttons = this.get('buttons');
    var boundary = this.get('deck.boundary');

    var _this = this;

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

    //Add the dropshadow to the defs
    var filter = svg.append('defs')
      .append('filter')
      .attr('id', 'dropshadow')
      .attr('height', '130%');

    filter.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', '2');

    filter.append('feOffset')
      .attr('dx', 4)
      .attr('dy', 4)
      .attr('result', 'offsetblur');

    var feMerge = filter.append('feMerge');

    feMerge.append('feMergeNode');
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

    svg.append('rect')
      .attr('width', page.width)
      .attr('height', page.height)
      .style('fill', 'none')
      .style('pointer-events', 'all');

    var zoomContainer = svg.append('g');

    //deck is always center
    var deck = zoomContainer.append('g')
      .attr('transform', 'translate(' + (page.width - boundary.width) / 2 + ',' + (page.height - boundary.height) / 2 + ')');

    //Draw the grid via lines
    var linespace = boundary.height / 63;
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
      .data(d3.entries(buttons))
      .enter().append('circle')
      .classed('pressed', function (d) {return d.value.value;})
      .attr('r', linespace * 4)
      .attr('cx', function (d) { return d.value.ui.x; })
      .attr('cy', function (d) { return d.value.ui.y; })
      .on("click", function (d) {
        d.value.value = !d.value.value;
        _this.updateButton(d.key, d.value);
        d3.select(this).classed('pressed', d.value.value);
        d3.event.stopPropagation();
      })
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
      if (_this.isEditing) {
        d3.select(this).classed('dragging', true);
        d3.select(this)
          .attr('r', linespace * 4)
          .transition()
          .duration(200)
          .attr('r', linespace * 4.6);
      }
    }

    function dragged(d) {
      if (_this.isEditing) {
        d3.select(this).attr('cx', d.x = d3.event.x).attr('cy', d.y = d3.event.y);
      }
    }

    function dragended() {
      d3.select(this).classed('dragging', false);
      if (_this.isEditing) {
        d3.select(this)
          .attr('r', linespace * 4.6)
          .transition()
          .duration(200)
          .attr('r', linespace * 4);
        var d = d3.select(this).data()[0];
        d.value.ui.x = d3.event.x;
        d.value.ui.y = d3.event.y;
        _this.updateButton(d.key, d.value);
      }
    }
  },

  didInsertElement: function () {
    var el = this.$();
    var w = el.css('width');
    var h = el.css('height');

    //Allow capturing keydown/keyup maybe better to do this on document (globally, if we remove the listener on exit...)
    //div's cannot be focused unless you use the 'tabindex' property, setting it to 0 ensures it can be tabbed into and is focusable.
    el.attr('tabindex', 0);
    el.focus();

    this.draw(w, h);
  }
});
