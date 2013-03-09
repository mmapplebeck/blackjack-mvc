var app = app || {};

Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);

app.ChipView = Backbone.View.extend({
  className: "chip-container",
  
  template: _.template( $('#chip-template').html() ),
  
  initialize: function () {
    // Attach event listeners
    this.model.on('change:state', this.render, this);
    this.eventAggregator.on("app:endgame", this.deactivate, this);
    this.eventAggregator.on("app:deal", this.deactivate, this);
  },
  
  events: {
    'click .chip': 'updateChip'
  },
  
  activate: function () {
    this.model.set("state", "active");
  },
  
  deactivate: function () {
    this.model.set("state", "inactive");
  },
  
  updateChip: function () {
    // If chip element is clicked, and it's active,
    // then trigger event
    if (this.model.get("state") === "active") {
      this.eventAggregator.trigger("chip:click", this.model);
    }
  },
  
  render: function () {
    this.$el.html( this.template( this.model.toJSON() ) );
    return this;
  }
});