var app = app || {};

Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);

app.ActionsView = Backbone.View.extend({
  el: "#actions",
  
  initialize: function () {
    this.render();
  },
  
  render: function () {
    _.each(this.collection.models, function(action) {
      var view = new app.ActionView({ model: action });
      this.$el.append( view.render().el );
    }, this);
  }
});