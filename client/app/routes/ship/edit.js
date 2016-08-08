import Ember from 'ember';

export default Ember.Route.extend({

  //model: function() {
  //  return this.store.find('ship', );
  //}

  model: function (params) {
    console.log(params, this.store.findRecord('ship', params.id));
    return this.store.findRecord('ship', params.id);
  }

});
