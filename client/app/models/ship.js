import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  net: DS.attr(),
  softIO: DS.attr(),
  deckData: DS.attr()
});
