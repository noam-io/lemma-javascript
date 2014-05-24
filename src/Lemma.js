//Copyright (c) 2014, IDEO 

//= require MessageBuilder
//= require EventFilter
//= require MessageHandler
//= require EventSender

var isNode = false;
var debugMode = false;
if(typeof module !== 'undefined' && module.exports){
  isNode = true;
  var EventFilter = require('./EventFilter'),
  MessageBuilder = require('./MessageBuilder'),
  MessageHandler = require('./MessageHandler'),
  EventSender = require('./EventSender'),
  WebSocket = require('ws');
}

function Lemma(lemmaId, desiredRoom, debug) {
  this.connected = false;
  this.lemmaId = lemmaId;
  this.desiredRoom = desiredRoom;
  if( debug == "DEBUG") this.debugMode = true;
  this.messageBuilder = new MessageBuilder(this.lemmaId);
  this.eventFilter = new EventFilter();
  this.messageHandler = new MessageHandler(this.eventFilter);
}

Lemma.prototype.debug = function(str){ 
  if(this.debugMode){
    console.log(str); 
  }
};
Lemma.prototype.isConnected = function(){ return !!this.connected; };

Lemma.prototype.begin = function(host, port) {
  var lemma = this;
  var ws = new WebSocket("ws://" + host + ":" + port.toString() + "/websocket");
  lemma.sender = new EventSender(ws, this.messageBuilder);

  ws.onmessage = function(evt) { lemma.messageHandler.receive(evt.data); };
  ws.onclose = function() {
    lemma.connected = false;
    lemma.debug("socket closed");
    lemma.sender = null;
    if(lemma.onDisconnectCallback) {
      lemma.onDisconnectCallback();
    }
  };
  ws.onopen = function() {
    lemma.debug("connected...");
    lemma.sender.sendRegister([], lemma.eventFilter.events());
    lemma.connected = true;
  };
  ws.onerror = function(err) {
    lemma.connected = false;
    lemma.debug("Web socket Error");
    lemma.debug(err);
    lemma.sender = null;
    if(lemma.onDisconnectCallback) {
      lemma.onDisconnectCallback();
    }
  };
};

Lemma.prototype.hears = function(name, callback) {
  this.eventFilter.add(name, callback);
};

Lemma.prototype.sendEvent = function(name, value) {
  if (this.sender) {
    try {
      this.sender.sendEvent(name, value);
    } catch (e) {
      this.debug("Error trying to send: " + e);
      this.sender = null;
      if(this.onDisconnectCallback) {
        this.onDisconnectCallback();
      }
    }
  }
  else {
    this.debug("You must 'begin' the lemma before sending a message");
  }
};

if(isNode){
  module.exports = Lemma;
}

