import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    updateShip: function (ship) {
      ship.save();
    },
    toggleButton: function (ship, b) {
      //Need to use set/get here, maybe should be using observable
      Ember.set(b, 'value', !Ember.get(b, 'value'));
      //Ensure changes are propagated to firebase
      ship.save();
    }
  }
});
