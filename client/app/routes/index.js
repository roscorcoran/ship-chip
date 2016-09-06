import Ember from 'ember';

export default Ember.Route.extend({
  //In future this should redirect to the favourite ship!
  redirect: function () {
    this.transitionTo('ships');
  }
});
