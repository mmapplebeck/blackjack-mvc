var app = app || {};

var Deck = Backbone.Collection.extend({
  model: Card,
  
  initialize: function () {
    
    // Create and shuffle deck on initialization
    this.create();
    this.shuffle();
  },
  
  create: function () {
    var ranks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'],
        suits = ['hearts', 'spades', 'clubs', 'diams'],
        rlen = ranks.length,
        slen = suits.length,
        r,
        s;
    
    // Add cards to deck collection
    for (r = 0; r < rlen; r++) {
      for (s = 0; s < slen; s++) {
        this.add({
          rank: ranks[r],
          suit: suits[s]
        })
      }
    }
  },
  
  drawCard: function () {
    return this.pop();
  },
  
  shuffle: function () {
    var shuffled = _.shuffle(this.models);
    this.models = shuffled;
  }
});