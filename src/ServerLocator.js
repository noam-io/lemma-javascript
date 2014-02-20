var isNode = false;

if(typeof module !== 'undefined' && module.exports){
  isNode = true;
  var Datagram = require('dgram'),
  MessageBuilder = require('./MessageBuilder'),
  MessageParser = require('./MessageParser');
}

function ServerLocator(lemma) {
  this.lemma = lemma;
  this.lemma.onDisconnectCallback = this.beginLocating;
  this.broadcastHost = "255.255.255.255";
  this.broadcastPort = 1030;
  this.dialect = "node.js";
  this.protocolVersion = "1.1";

  this.webSocketPort = 8089;
}

ServerLocator.prototype.beginLocating = function(desiredRoom) {
  var serverLocator = this;
  var lemma = this.lemma;
  var message = new MessageBuilder(lemma.lemmaId).marco(desiredRoom || "");

  var udp = Datagram.createSocket("udp4");

  udp.on("error", function (err) {
    console.log("udp error:\n" + err.stack);
    udp.close();
  });

  udp.on("message", function (message, sender) {
    if(lemma.isConnected()) { return; }
    var parsed = new MessageParser().parse(message);
    if(parsed[0] === "polo") {
      console.log("got polo from " + sender.address + ":" + sender.port + " - " + message);
      lemma.begin(sender.address, serverLocator.webSocketPort);
    }
  });

  udp.on("listening", function () {
    var address = udp.address();
    console.log("udp listening " + address.address + ":" + address.port);
  });

  udp.bind(function() {
    udp.setBroadcast(true);
  });

  var fire = function() {
    if(lemma.isConnected()) { return; }
    var sendCallback = function() {
      console.log("sent marco: " + message);
      setTimeout(fire, 1000);
    };
    udp.send(new Buffer(message), 0, message.length,
             serverLocator.broadcastPort,
             serverLocator.broadcastHost,
             sendCallback);
  };

  setTimeout(fire, 1000);
};

if(isNode){
  module.exports = ServerLocator;
}
