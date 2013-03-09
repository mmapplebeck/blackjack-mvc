var app = app || {};

var Chips = Backbone.Collection.extend({
  initialize: function () {
    var chipVals = [
      1,
      5,
      10,
      25
    ];
    this.addChips(chipVals);
  },
  
  addChips: function(chipVals) {
    _.each(chipVals, function(chipVal) {
      this.add(new Chip({ val: chipVal }));
    }, this);
  }
});