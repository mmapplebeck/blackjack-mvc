var app = app || {};

var Actions = Backbone.Collection.extend({
  initialize: function () {
    var actions = [
      new Action({ id: "deal", msg: "Deal", role: "betting" }),
      new Action({ id: "reset", msg: "Reset Bet", role: "betting" }),
      new Action({ id: "hit", msg: "Hit", role: "playing" }),
      new Action({ id: "stay", msg: "Stay", role: "playing" }),
      new Action({ id: "new", msg: "Play Again", role: "replaying" }),
      new Action({ id: "continue", msg: "Buy Back In", role: "continue" })
    ];
    this.addActions(actions);
  },
  
  addActions: function(actions) {
    _.each(actions, function(action) {
      this.add(action);
    }, this);
  }
});