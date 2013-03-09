var app = app || {};

Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);

app.ActionView = Backbone.View.extend({
  className: "action",
  
  template: _.template( $('#action-template').html() ),
  
  initialize: function () {
    var _this = this;
    
    // Listen to model's state property and render view on change
    this.model.on('change:state', this.render, this);
    
    // Attach event listeners, and update model's state property accordingly
    this.eventAggregator.on("app:newgame", function () {
      if (_this.model.get("role") === "betting") {
        _this.model.set("state", "inactive");
      }
      else {
        _this.model.set("state", "hidden");
      }
    });
    this.eventAggregator.on("app:endgame", function () {
      if (_this.model.get("role") === "playing") {
        _this.model.set("state", "hidden");
      }
      else if (_this.model.get("role") === "replaying") {
        _this.model.set("state", "active");
      }
    });
    this.eventAggregator.on("app:playAsDealer", function () {
      if (_this.model.get("role") === "playing") {
        _this.model.set("state", "hidden");
      }
    });
    this.eventAggregator.on("app:deal", function () {
      if (_this.model.get("role") === "betting") {
        _this.model.set("state", "hidden");
      }
    });
    this.eventAggregator.on("app:playerHit", function () {
      if (_this.model.get("role") === "playing") {
        _this.model.set("state", "inactive");
      }
    });
    this.eventAggregator.on("app:playerTurn", function () {
      if (_this.model.get("role") === "playing") {
        _this.model.set("state", "active");
      }
    });
    this.eventAggregator.on("app:endPlayerTurn", function () {
      if (_this.model.get("role") === "playing") {
        _this.model.set("state", "inactive");
      }
    });
    this.eventAggregator.on('chip:click', function () {
      if (_this.model.get("role") === "betting") {
        _this.model.set("state", "active");
      }
    });
    this.eventAggregator.on('app:zeroChips', function () {
      if (_this.model.get("id") === "continue") {
        _this.model.set("state", "active");
      }
      else {
        _this.model.set("state", "hidden");
      }
    });
  },
  
  render: function () {
    this.$el.html( this.template( this.model.toJSON() ) );
    return this;
  }
});