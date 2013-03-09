var app = app || {};

Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);

app.ChipsView = Backbone.View.extend({
  el: "#chips",
  
  initialize: function () {
    // Create chip views
    _.each(this.collection.models, function(chip) {
      chipView = new app.ChipView({ model: chip });
      this.$el.append( chipView.render().el );
    }, this);
  }

});