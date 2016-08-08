import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    updateShip: function(ship) {
      ship.save();
    }
  }
});
