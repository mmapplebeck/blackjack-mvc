var app = app || {};

Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);

app.HandView = Backbone.View.extend({

  initialize: function () {
    var _this = this;
    
    // Get DOM elements
    this.$total = this.$('.total');
    this.$cards = this.$('.cards');
    
    // Create buffer
    this.buffer = new Buffer();
    
    // Attach event listers
    this.collection.on("add", function(card) {
      _this.appendCard(card);
      _this.flipCard(card);
    });
    
    this.eventAggregator.on("app:unhideHiddenCard", function(hidden_card) {
      _this.flipCard(hidden_card);
    }, this);
    
    this.eventAggregator.on("app:newgame", function () {
      _this.collection.reset();
      _this.updateTotal(0);
    }, this);
  },
  
  flipCard: function(card) {
    var total = this.collection.calcTotal(),
        _this = this;
    
    // Flip card and update total if card not hidden
    this.buffer.add(function(next) {
      setTimeout(function () {
        card.flip();
        if (!card.get("hidden")) {
          _this.updateTotal(total);
        }
        next();
      }, 400);
    });
  },
  
  updateTotal: function(total) {
    var total = total || this.collection.calcTotal();
    this.$total.html( total );
  },

  appendCard: function(card) {
    var view = new app.CardView({ model: card }),
        _this = this;
    
    // Append newly created card view to hand el
    this.buffer.add(function(next) {
      setTimeout(function () {
        _this.$cards.append( view.render().el );
        next();
      }, 200);
    });
  }
});