var firebase = require("firebase");
var fs = require('fs');

var Config = require('./shipConfig.js');

var firebaseConfig = {
  apiKey: "AIzaSyDrjTwTt-_KXK8XGZCGy0y_1Ou_NBYmrq0",
  authDomain: "ship-582de.firebaseapp.com",
  databaseURL: "https://ship-582de.firebaseio.com",
  storageBucket: "ship-582de.appspot.com"
};

firebase.initializeApp({
  serviceAccount: "run/ship.json",
  databaseURL: firebaseConfig.databaseURL
});

var configFile = './run/config.json';

var db = firebase.database();
var ships = db.ref("ships");

//Use the config module to get a current or generate a new config.
var config = new Config(configFile, ships);

//Once we have our configuration loaded from the server we can run all defined IO event handlers
config.once('loaded', (config) => {
  //Get a reference to this ships model
  var shipRef = ships.child(config.key);

  //An event handler for this specific Ship
  shipRef.on("child_changed", function (snapshot) {
    var newValue = snapshot.val();
    console.log(snapshot.key + ' changed to: ', newValue);
  });

  //Event handler for this Ships soft-io changes.
  var IORef = shipRef.child('softIo');
  IORef.on("child_changed", function (snapshot) {
    var newValue = snapshot.val();
    console.log("Changed IO", newValue);
  });

});