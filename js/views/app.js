var app = app || {};

Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);

app.AppView = Backbone.View.extend({
  model: new App(),
  
  el: "#game",
  
  initialize: function () {
    // Get DOM elements
    this.$stake = this.$('#stake');
    this.$chip_total = this.$('#chip-total');
    this.$chips = this.$('#chips');
    this.$msg = this.$('#msg');
    
    // Create app buffer
    this.buffer = new Buffer();
    
    // Create views
    new app.PlayerView({ model: this.model.get("player"), el: $('#player') });
    new app.PlayerView({ model: this.model.get("dealer"), el: $('#dealer') });
    new app.ChipsView({ collection: this.model.get("chips"), el: this.$chips });
    new app.ActionsView({ collection: this.model.get("actions") });
    
    // Attach event listeners
    this.eventAggregator.on('chip:click', function(chip) {
      this.updateBet(chip);
    }, this);
    
    this.model.on('change:stake', this.updateStake, this);
    
    this.model.on('change:chip_total', function () {
      this.updateChipTotal();
      this.model.updateChipStates();
    }, this);
    
    // Start game
    this.startNewGame();
  },
  
  events: {
    'click #hit': 'playerHit',
    'click #stay': 'playAsDealer',
    'click #deal': 'dealHand',
    'click #reset': 'clearBet',
    'click #new': 'startNewGame',
    'click #continue': 'buyBack'
  },
  
  buyBack: function () {
    this.model.set(this.model.defaults);
    this.startNewGame();
  },
  
  startNewGame: function () {
    this.updateStake();
    this.updateChipTotal();
    this.model.updateChipStates();
    this.$msg.addClass('hidden');
    this.eventAggregator.trigger("app:newgame");
  },
  
  endGame: function() {
    var _this = this;
    
    // Decide winner and display message to player
    this.$msg.html(this.model.decideWinner());
    this.$msg.removeClass("hidden");
    
    if (this.model.get("chip_total") !== 0) {  
      this.eventAggregator.trigger("app:endgame");
      this.model.decideReshuffle();
    }
    else {
      setTimeout(function () {
        _this.$msg.html("Sorry, you're out of chips!");
        _this.eventAggregator.trigger("app:zeroChips");
      }, 1000);
    }
  },

  playAsDealer: function () {
    var dealer_hand = this.model.get("dealer").get("hand"),
        hidden_card = dealer_hand.at(1);

    // Trigger dealer event, unhide hidden card, and make next move
    this.eventAggregator.trigger("app:playAsDealer");
    this.eventAggregator.trigger("app:unhideHiddenCard", hidden_card);
    
    hidden_card.unhide();
    this.dealerHit();
  },
  
  dealerHit: function () {
    var dealer_total = this.model.get("dealer").get("hand").calcTotal(),
        _this = this;
    
    // Dealer stays on 17
    if (dealer_total > 16) {
      this.buffer.add(function(next) {
        _this.endGame();
        next();
      });
    }
    else {
      this.buffer.add(function(next) {
        _this.model.hit(_this.model.get("dealer"));
        _this.dealerHit();
        next();
      })
    }
  },
  
  dealHand: function () {
    var _this = this;
    
    // Deal, then evaluate player's hand
    if ( $('#deal').hasClass('active') ) {
      this.buffer.add(function(next) {
        _this.model.deal();
        _this.eventAggregator.trigger('app:deal');
        next();
      });
      this.buffer.add(function(next) {
        _this.evaluatePlayer();
        next();
      });
    }
  },
  
  playerHit: function () {
    var _this = this;
    
    // Hit, then evaluate player's hand
    if ( $('#hit').hasClass('active') ) {
      this.buffer.add(function(next) {
        _this.model.hit(_this.model.get("player"));
        _this.eventAggregator.trigger("app:playerHit");
        next();
      });
      this.buffer.add(function(next) {
        _this.evaluatePlayer();
        next();
      });
    }
  },
  
  evaluatePlayer: function () {
    var player_total = this.model.get("player").get("hand").calcTotal(),
        dealer_hand,
        hidden_card,
        _this = this;
    
    
    // If player does not bust or have Blackjack, trigger another turn
    // Otherwise, end game and show dealer's hidden card
    if (player_total < 21) {
      this.eventAggregator.trigger("app:playerTurn");
    }
    else {
      dealer_hand = this.model.get("dealer").get("hand");
      hidden_card = dealer_hand.at(1);
          
      this.eventAggregator.trigger("app:endPlayerTurn");
      
      this.buffer.add(function(next) {
        _this.endGame();
        next();
      });
      this.buffer.add(function(next) {
        hidden_card.unhide();
        _this.eventAggregator.trigger("app:unhideHiddenCard", hidden_card);
        next();
      });
    }
  },
  
  updateStake: function () {
    this.$stake.html( this.model.get("stake") );
  },
  
  updateChipTotal: function () {
    this.$chip_total.html( this.model.get("chip_total") );
  },
  
  updateBet: function(chip) {
    this.model.updateBet(chip);
  },
  
  clearBet: function () {
    this.model.clearBet();
  }
});