var firebase = require('firebase');
var fs = require('fs');
var five = require('johnny-five');
var chipio = require('chip-io');
var q = require('q');


//Johny five & chip
var board = new five.Board({
  //When running Johnny-Five programs as a sub-process (eg. init.d, or npm scripts), be sure to shut the REPL off!
  repl: false,
  io: new chipio()
});

//Johny five & arduino

//Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyDrjTwTt-_KXK8XGZCGy0y_1Ou_NBYmrq0',
  authDomain: 'ship-582de.firebaseapp.com',
  databaseURL: 'https://ship-582de.firebaseio.com',
  storageBucket: 'ship-582de.appspot.com'
};

firebase.initializeApp({
  serviceAccount: 'run/ship.json',
  databaseURL: firebaseConfig.databaseURL
});

var db = firebase.database();
var ships = db.ref('ships');

//Local configuration
var configFile = './run/config.json';
var Config = require('./shipConfig.js');

//Use the config module to get a current or generate a new config.
var config = new Config(configFile, ships);

var deferredChipBoard = q.defer();
var deferredConfig = q.defer();
var io;

var IO_HANDLERS = {
  setStatusLed: function (status) {
    console.log('StatusLed', status);
    io.statusLed.stop();
    if(status){
      io.statusLed.on();
    } else {
      io.statusLed.off();
    }
  },
  setPin: function (status, pin) {
    console.log('Pin: ', pin, ' Status: ', status);
  }
};

board.on('ready', function() {

  var statusLed = new chipio.StatusLed();
  // Blink every half second
  statusLed.blink(500);

  io = {
    statusLed : statusLed
  };

  deferredConfig.resolve(board, io);
});

//Once we have our configuration loaded from the server we can run all defined IO event handlers
config.once('loaded', (id) => {
  //Get a reference to this ships model
  var shipRef = ships.child(id);
  //An event handler for this specific Ship
  //shipRef.on('child_changed', function (snapshot) {
  //  var newValue = snapshot.val();
  //  console.log(snapshot.key + ' changed to: ', newValue);
  //});

  //Setup event handlers for all soft IO events
  //If a buttons value changes, all attached handlers are fired with the new value
  var softButtons = shipRef.child('softIO/buttons');

  softButtons.once('value', function handleSoftButtonChanges(snapshot){
    var newButtons = snapshot.val();
    for (var button in newButtons) {
      if (newButtons.hasOwnProperty(button)) {
        softButtons.child(button).on('value', updateHandlers);
      }
    }
  });

  deferredChipBoard.resolve(shipRef);
});

q.all([deferredConfig.promise, deferredChipBoard.promise]).then(function(){
  //console.log(arguments);
});

function isFunction(o){
  return Object.prototype.toString.call(o) === '[object Function]';
}

function isArray(o){
  return Object.prototype.toString.call(o) === '[object Array]';
}

function getIOHandler(name){
  return IO_HANDLERS[name];
}

function updateHandlers(snapshot) {
  var newButton = snapshot.val();
  if(isArray(newButton.handlers)){
    newButton.handlers.forEach(function (handlerObj) {
      var handler = getIOHandler(handlerObj.action);
      if(isFunction(handler)){
        //Execute the handler in a new scope with the given arguments
        handler.apply({}, [newButton.value].concat(handlerObj.args || []));
      }
    });
  }
}