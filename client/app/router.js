import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('ship', function() {
    this.route('new');
    this.route('edit', { path: "/edit/:id" });
    this.route('manage', { path: "/manage/:id" });
  });
  this.route('ships');
  this.route('login');
  this.route('ship-deck');
});

export default Router;
