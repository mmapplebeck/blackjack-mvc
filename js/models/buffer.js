var app = app || {};

var Buffer = Backbone.Model.extend({
  defaults: {
    commands: []
  },

  add: function(fn) {
    // Adds a command to the buffer, and executes it if it's
    // the only command to be ran.
    var commands = this.get("commands");
    commands.push(fn);
    
    if (this.get("commands").length == 1) {
      fn(next);
    }

    // Moves onto the next command in the buffer.
    function next() {
      commands.shift();
      if (commands.length) commands[0](next);
    }
  }
});