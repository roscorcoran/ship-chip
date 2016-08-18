var five = require('johnny-five');
var chipio = require('chip-io');

var board = new five.Board({
  io: new chipio()
});

board.on('ready', function() {
  // create battery voltage sensor
  var batteryVoltage = new chipio.BatteryVoltage();

  // listen for value changes
  batteryVoltage.on('change', function(voltage) {
    console.log('Battery voltage is ' + voltage.toFixed(2) + 'V');
  });

  // Create an LED for the STATUS LED
  var statusLed = new chipio.StatusLed();

  // Blink every half second
  statusLed.blink(500);
  
  // Create an button on the XIO-P1 pin
  var button = new five.Button('XIO-P1');

  // add event listeners for 'up' and 'down' events

  button.on('down', function() {
    console.log('down');
  });

  button.on('up', function() {
    console.log('up');
  });


  //var thermometer = new chipio.InternalTemperature();

  //thermometer.on('data', function(data) {
  //  console.log('Internal temperature is ' + data.celsius.toFixed(2) + '°C');
  //});

  //thermometer.on('change', function(data) {
  //  console.log('Internal temperature is ' + data.celsius.toFixed(2) + '°C');
  //});

});
