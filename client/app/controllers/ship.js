import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    destroyShip: function(ship) {
      ship.deleteRecord();
      ship.save();
    }
  }
});
