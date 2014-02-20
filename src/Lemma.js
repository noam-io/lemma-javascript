//= require MessageBuilder
//= require EventFilter
//= require MessageHandler
//= require EventSender

var isNode = false;
if(typeof module !== 'undefined' && module.exports){
  isNode = true;
  var MessageBuilder = require('./MessageBuilder'),
         EventFilter = require('./EventFilter'),
      MessageHandler = require('./MessageHandler'),
         EventSender = require('./EventSender'),
           WebSocket = require('ws');
}

function Lemma(lemmaId) {
  this.messageBuilder = new MessageBuilder(lemmaId);
  this.eventFilter = new EventFilter();
  this.messageHandler = new MessageHandler(this.eventFilter);
}

Lemma.prototype.debug = function(str){ console.log(str);};

Lemma.prototype.begin = function(host, port) {
  var lemma = this;
  var ws = new WebSocket("ws://" + host + ":" + port.toString() + "/websocket");
  lemma.sender = new EventSender(ws, this.messageBuilder);

  ws.onmessage = function(evt) { lemma.messageHandler.receive(evt.data); };
  ws.onclose = function() { lemma.debug("socket closed"); };
  ws.onopen = function() {
    console.log("connected...");
    lemma.sender.sendRegister([], lemma.eventFilter.events());
  };
  ws.onerror = function(err) {
    lemma.debug("Web socket Error");
    lemma.debug(err);
  };
};

Lemma.prototype.hears = function(name, callback) {
  this.eventFilter.add(name, callback);
};

Lemma.prototype.sendEvent = function(name, value) {
  if (this.sender) {
    this.sender.sendEvent(name, value);
  }
  else {
    this.debug("You must 'begin' the lemma before sending a message");
  }
};

if(isNode){
  module.exports = Lemma;
}

