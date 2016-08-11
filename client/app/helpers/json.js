import Ember from 'ember';

export default Ember.Helper.extend({
  compute(params, hash) {
    return JSON.stringify(params[0], null, 2);
  }
});
