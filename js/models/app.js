var app = app || {};

var App = Backbone.Model.extend({
  defaults: {
    chip_total: 25,
    stake: 0
  },
  
  initialize: function () {
    this.set("deck", new Deck());
    this.set("dealer", new Player({ role: "dealer", name: "dealer" }));
    this.set("player", new Player({ role: "player", name: "you" }));
    this.set("chips", new Chips());
    this.set("actions", new Actions());
  },
  
  deal: function () {
    var player_card,
        dealer_card,
        deck = this.get("deck");
    
    // Deal two cards each, setting the dealer's second card hidden
    for (var i = 2; i > 0; i--) { 
      player_card = deck.drawCard();
      dealer_card = deck.drawCard();
      if (i === 1) {
        dealer_card.set("hidden", true);
      }
      this.get("player").addCard(player_card);
      this.get("dealer").addCard(dealer_card);
    }
  },
  
  hit: function(player) {
    player.addCard(this.get("deck").drawCard());
  },
  
  winHand: function(withBlackjack) {
    var chip_total = this.get("chip_total"),
        stake = this.get("stake");

    this.set("chip_total", Math.floor(chip_total + (stake * 2)));
    
    // Blackjack returns 1.5
    if (withBlackjack) {
      this.set("chip_total", Math.floor(chip_total + (stake * 2) + (stake / 2)));
    }
    
    this.set("stake", 0);
  },
  
  loseHand: function () {
    this.set("stake", 0);
  },
  
  pushHand: function () {
    // A tie results in no chips lost or gain
    this.set("chip_total", this.get("chip_total") + this.get("stake"));
    this.set("stake", 0);
  },
  
  updateBet: function(chip) {
    var new_stake = this.get("stake") + chip.get("val"),
        new_chip_total = this.get("chip_total") - chip.get("val");
        
    this.set("stake", new_stake);
    this.set("chip_total", new_chip_total);
  },
  
  clearBet: function () {
    var current_stake = this.get("stake"),
        current_chip_total = this.get("chip_total");

    this.set("chip_total", current_chip_total + current_stake);
    this.set("stake", 0);
  },
  
  updateChipStates: function () {
    // Set chip inactive if player total is less than chip value
    _.each(this.get("chips").models, function(chip) {
      if (this.get("chip_total") >= chip.get("val")) {
        chip.set("state", "active");
      }
      else {
        chip.set("state", "inactive");
      }
    }, this);
  },
  
  decideWinner: function () {
    // Compare dealer and player hands and decide winner
    var player_total = this.get("player").get("hand").calcTotal(),
        dealer_total = this.get("dealer").get("hand").calcTotal();
        
    if (player_total > dealer_total) {
      if (player_total < 21 || (player_total === 21 && this.get("player").get("hand").length > 2)) { 
        this.winHand();
        return "You win!";
      }
      else if (player_total > 21) {
        this.loseHand();
        return "You bust!";
      }
      else {
        this.winHand(true);
        return "BlackJack!";
      }
    }
    else if (player_total < dealer_total) {
      if (dealer_total > 21) {
        this.winHand();
        return "Dealer busts!";
      }
      else {
        this.loseHand();
        return "You lose!";
      }
    }
    else {
      this.pushHand();
      return "Push!";
    }
  },
  
  decideReshuffle: function () {
    // Reshuffle if more than half the deck has been used
    if (this.get("deck").length < (52 * .5)) {
      this.set("deck", new Deck());
    }
  }
});