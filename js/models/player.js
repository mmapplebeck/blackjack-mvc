var app = app || {};

var Player = Backbone.Model.extend({
  
  initialize: function () {
    this.set("hand", new Hand());
  },
  
  addCard: function(card) {
    this.get("hand").add(card);
  },
  
  addChips: function(num_chips) {
    this.set("chip_total", chip_total + num_chips);
  }
});