var app = app || {};

Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);

app.PlayerView = Backbone.View.extend({
  
  initialize: function () {
    // Add to DOM and create hand view
    this.$el.html( this.template( this.model.toJSON() ) );
    this.addHand();
  },
  
  template: _.template( $('#player-template').html() ),
  
  addHand: function () {
    new app.HandView({ collection: this.model.get("hand"), el: this.$('.hand') });
  }
});