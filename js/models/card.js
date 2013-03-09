var app = app || {};

var Card = Backbone.Model.extend({
  defaults: {
    face_down: true,
    hidden: false
  },
  
  initialize: function () {
    this.setVal();
    this.setSuitChar();
  },
  
  setSuitChar: function () {
    // Set HTML character code based on card's suit
    this.set("suit_char", "&" + this.get("suit") + ";");
  },
  
  setVal: function () {
    // Determine game value of card based on card rank
    var val = this.get("rank");
    
    // Set value of aces to 11 by default
    // The calcTotal method in the Hand collection will change
    // its value to 1 if necessary
    if (val === "A") {
      val = 11;
    }
    else if (val === "J" || val === "Q" || val === "K") {
      val = 10;
    }
    
    this.set("val", val);
  },
  
  flip: function () {
    if (!this.get("hidden")) {
      this.set("face_down", false);
    }
  },
  
  unhide: function() {
    this.set("hidden", false);
  }
});