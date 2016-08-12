import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    signIn: function (email, password) {
      var _this = this;
      //Use the firebase session and password provider to authenticate this user
      _this.get('session').open('firebase', {
        provider: 'password',
        email: email,
        password: password
      })
        .then(function (data) {
          console.log(data.currentUser);
          _this.transitionTo('ships');
        });
    }
  }
});
