import Ember from 'ember';

export default Ember.Route.extend({
  //This hook is the first of the route entry validation hooks called when an attempt is made to transition into a route or one of its children.
  //It is appropriate for cases when:
  // 1) A decision can be made to redirect elsewhere without needing to resolve the model first.
  // 2) Any async operations need to occur first before the model is attempted to be resolved.

  beforeModel: function() {
    var _this = this;
    return this.get('session').fetch().catch(function() {
      _this.transitionTo('login');
    });
  },
  actions: {
    signOut: function() {
      this.get('session').close();
      this.transitionTo('login');
    }
  }
});
