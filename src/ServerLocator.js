//Copyright (c) 2014, IDEO 

var isNode = false;
var debugMode = false;
if(typeof module !== 'undefined' && module.exports){
  isNode = true;
  var Datagram = require('dgram'),
  MessageBuilder = require('./MessageBuilder'),
  MessageParser = require('./MessageParser');
}


/* jshint ignore:start */
// from http://mzl.la/1fFEbu9
if(!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
    fToBind = this,
    fNOP = function () {},
    fBound = function () {
      return fToBind.apply(this instanceof fNOP && oThis
        ? this
        : oThis,
        aArgs.concat(Array.prototype.slice.call(arguments)));
    };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
/* jshint ignore:end */

function ServerLocator(lemma) {
  this.lemma = lemma;
  this.lemma.onDisconnectCallback = this.beginLocating.bind(this);
  this.broadcastHost = "255.255.255.255";
  this.broadcastPort = 1030;
  this.dialect = "node.js";
  this.protocolVersion = "2";

  this.webSocketPort = 8089;
}

ServerLocator.prototype.beginLocating = function() {
  var serverLocator = this;
  var lemma = this.lemma;
  var desiredRoom = lemma.desiredRoom;
  var message = new MessageBuilder(lemma.lemmaId).marco(desiredRoom || "");

  var udp = Datagram.createSocket("udp4");

  udp.on("error", function (err) {
    lemma.debug("udp error:\n" + err.stack);
    udp.close();
  });

  udp.on("message", function (message, sender) {
    if(lemma.isConnected()) { return; }
    var parsed = new MessageParser().parse(message);
    if(parsed[0] === "polo") {
      lemma.debug("got polo from " + sender.address + ":" + sender.port + " - " + message);
      lemma.begin(sender.address, serverLocator.webSocketPort);
    }
  });

  udp.on("listening", function () {
    var address = udp.address();
    lemma.debug("udp listening " + address.address + ":" + address.port);
  });

  udp.bind(function() {
    udp.setBroadcast(true);
  });

  var fire = function() {
    if(lemma.isConnected()) { return; }
    var sendCallback = function() {
      lemma.debug("sent marco: " + message);
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
