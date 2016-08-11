var util = require('util');
var fs = require('fs');
var os = require('os');
var EventEmitter = require('events').EventEmitter;

var Config = function (configFile, ships) {

  // we need to store the reference of `this` to `self`, so that we can use the current context in the setTimeout (or any callback) functions
  // using `this` in the setTimeout functions will refer to those functions, not the Radio class
  var self = this;

  //Check for a local config ref, if we have one load it from the server, if not make a new one
  configExists(function (exists) {
    if (exists) {
      getShipId(function (id) {
        self.emit('loaded', id);
        //Update the network model for this device (firebase push to server)
        updateNetworkStatus(id);
      });
    } else {
      autoConfig(function (id) {
        self.emit('loaded', id);
      });
    }
  });

  function autoConfig(cb) {
    //Auto register, so make a new config and save it locally
    var newShipRef = ships.push();
    var config = {
      name: "NEW",
      description: "Configure me!",
      net: getNetworkInterfacesIPV4(),
      softIO: {
        buttons: {}
      }
    };

    newShipRef.set(config);

    var buttons = newShipRef.child('softIO/buttons');

    buttons.push({
      name: 'Toggle status led',
      value: true,
      handlers: [
        {action: 'setStatusLed'}
      ]
    });

    buttons.push({
      name: 'Toggle pin1',
      value: true,
      handlers: [
        {action: 'setPin', args: ['pin1']}
      ]
    });

    config.key = newShipRef.key;
    //Save the key (id) only
    saveConfig(config.key);
    cb(config.key);
  }

  function saveConfig(id) {
    if (id) {
      fs.writeFile(configFile, JSON.stringify({id: id}, null, 2), (err) => {
        if (err) throw err;
      });
    } else {
      throw new Error('No ID provided for configuration');
    }
  }

  function updateNetworkStatus(id) {
    var shipRef = ships.child(id);
    var netRef = shipRef.child('net');
    netRef.set(getNetworkInterfacesIPV4());
  }

  function getNetworkInterfacesIPV4() {
    var interfaces = os.networkInterfaces();
    //Get the IP addresses
    var addresses = [];
    for (var k in interfaces) {
      for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
          addresses.push(address);
        }
      }
    }
    return addresses;
  }

  function getShipId(cb) {
    fs.readFile(configFile, (err, data) => {
      if (err) throw err;
      var config = JSON.parse(data.toString());
      cb(config.id);
    });
  }

  function configExists(cb) {
    fs.stat(configFile, (err, stat) => {
      cb(!err && stat.isFile());
    });
  }

};

// extend the EventEmitter class using our Radio class
util.inherits(Config, EventEmitter);

// we specify that this module is a reference to the Radio class
module.exports = Config;