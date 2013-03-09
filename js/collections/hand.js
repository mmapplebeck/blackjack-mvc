var app = app || {};

var Hand = Backbone.Collection.extend({
  model: Card,

  calcTotal: function () {
    // Calculate and return current hand total
    var aces = [],
        card,
        i,
        len = this.length,
        total = 0;

    // Loop through cards in the hand and add to total
    for (i = 0; i < len; i++) {
      card = this.at(i);
      total += card.get("val");
      if (card.get("rank") === "A") {
        aces.push(card);
      }
    }

    // If total is bust and ace in hand, decrease value
    // of ace if not already decreased and adjust total
    if (total > 21 && aces.length > 0) {
      for (i = 0, len = aces.length; i < len; i++) {
        if ((aces[i].get("val") === 11) && (total -= 10 >= 21)) {
          total -= 10;
          aces[i].set("val", 1);
        }
      }
    }
    
    return total;
  }
});