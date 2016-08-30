import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    updateShip: function (ship) {
      ship.save();
    },
    toggleButton: function (ship, b) {
      Ember.set(b, 'value', !Ember.get(b, 'value'));
      ship.save();
    }
  }
});
