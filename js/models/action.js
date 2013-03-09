var app = app || {};

var Action = Backbone.Model.extend({
  
  initialize: function () {
    this.set("state", "hidden");
  }
});