import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createShip: function() {
      var newship = this.store.createRecord('ship', {
        name: this.get('name'),
        description: this.get('description'),
        timestamp: new Date().getTime()
      });
      newship.save();
    }
  }
});
