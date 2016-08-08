var util = require('util');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

// @station - an object with `freq` and `name` properties
var Config = function(configFile, ships) {

  // we need to store the reference of `this` to `self`, so that we can use the current context in the setTimeout (or any callback) functions
  // using `this` in the setTimeout functions will refer to those functions, not the Radio class
  var self = this;

  //Check for a local config ref, if we have one load it from the server, if not make a new one
  fs.stat(configFile, (err, stat) => {
    if (!err && stat.isFile()) {
      loadConfig();
    } else {
      autoConfig();
    }
  });


  function loadConfig() {
    fs.readFile(configFile, (err, data) => {
      if (err) throw err;
      var config = JSON.parse(data.toString());
      var shipRef = ships.child(config.key);
      shipRef.once("value", (snapshot) => {
        var newConfig = snapshot.val();
        newConfig.key = config.key;
        saveConfig(newConfig);
      });
    });
  }

  function autoConfig() {
    //Auto register, so make a new config and save it locally
    var newShipRef = ships.push();
    var config = {
      name: "A NEW SHIP",
      description: "Configure me!"
    };
    newShipRef.set(config);
    config.key = newShipRef.key;
    saveConfig(config);
  }

  function saveConfig(config) {
    self.emit('loaded', config);
    fs.writeFile(configFile, JSON.stringify(config, null, 2), (err) => {
      if (err) throw err;
    });
  }

};

// extend the EventEmitter class using our Radio class
util.inherits(Config, EventEmitter);

// we specify that this module is a reference to the Radio class
module.exports = Config;