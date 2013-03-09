var app = app || {};

Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);

app.CardView = Backbone.View.extend({
  className: "card",
  
  initialize: function () {
    var _this = this;
    
    // Listen to model's face_down property and render on change
    this.model.on('change:face_down', function () {
      _this.eventAggregator.trigger('card:flip', _this.model);
      _this.render();
    }, this);
    
    // Destroy card on new game
    this.eventAggregator.on("app:newgame", function () {
      _this.remove();
    }, this);
    
    this.template = _.template( $("#card-template-" + _this.model.get("rank")).html() );
  },

  render: function () {
    this.$el.html( this.template( this.model.toJSON() ) );
    
    // Add flipped class if card should be face up to trigger CSS animation
    if (!this.model.get("face_down")) {
      this.$('.card-inner').addClass('flipped');
    }
    
    return this;
  }
});