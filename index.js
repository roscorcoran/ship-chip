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

var config = new Config(configFile, ships);

//Once we have our configuration loaded from the server we can run all defined IO event handlers
config.once('loaded', (config) => {
  var shipRef = ships.child(config.key);
  var IORef = shipRef.child('io');

  IORef.on("child_changed", function (snapshot) {
    var changedIO = snapshot.val();
    console.log("Changed IO", changedIO);
  });

  shipRef.on("child_changed", function (snapshot) {
    var changedShip = snapshot.val();
    console.log("Are you talking to me?", changedShip);
  });
});