import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    destroyShip: function (ship) {
      //Calls deleteRecord() and save()
      //ship.destroyRecord();
      ship.dontDestroyRecord();
    }
  }
});
