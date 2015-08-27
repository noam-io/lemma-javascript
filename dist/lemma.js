//Copyright (c) 2015, IDEO 

function EventFilter() {
  this.callbacks = {};
}

EventFilter.prototype.add = function(name, callback) {
  if (this.callbacks[name] === undefined) {
    this.callbacks[name] = [];
  }
  this.callbacks[name].push(callback);
};

EventFilter.prototype.handle = function(name, value) {
  var callbacks = this.callbacks[name];
  if (callbacks !== undefined) {
    callbacks.forEach(function (callback) {
      callback(name, value);
    });
  }
};

EventFilter.prototype.events = function() {
  return Object.keys(this.callbacks);
};

if(typeof module !== 'undefined' && module.exports){
  module.exports = EventFilter;
}

//Copyright (c) 2015, IDEO 

function EventSender(webSocket, builder) {
  this.systemVersion = "1.0";
  this.webSocket = webSocket;
  this.builder = builder;
}

EventSender.prototype.sendEvent = function(name, value){
  this.sendMessage(this.builder.event(name, value));
};

EventSender.prototype.sendRegister = function(plays, hears) {
  this.sendMessage(this.builder.register(plays, hears, "web", this.systemVersion));
};

EventSender.prototype.sendMessage = function(message) {
  this.webSocket.send(this.zeroPad(message.length, 6) + message);
};

EventSender.prototype.zeroPad = function(number, width) {
  return (new Array(width + 1 - number.toString().length)).join('0') + number;
};

if(typeof module !== 'undefined' && module.exports){
  module.exports = EventSender;
}

//Copyright (c) 2015, IDEO 

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


//Copyright (c) 2015, IDEO 

function MessageBuilder(lemma_id){
  this.lemma_id = lemma_id;
}

MessageBuilder.prototype.event = function(name, value){
  var output = [];
  output.push("event");
  output.push(this.lemma_id);
  output.push(name);
  output.push(value);
  return JSON.stringify(output);
};

MessageBuilder.prototype.register = function(plays, hears, device_id, system_version){
  var output = [];
  output.push('register');
  output.push(this.lemma_id);
  output.push(0);
  output.push(hears);
  output.push(plays);
  output.push(device_id);
  output.push(system_version);
  return JSON.stringify(output);
};

MessageBuilder.prototype.marco = function(desiredRoom){
  var output = [];
  output.push('marco');
  output.push(this.lemma_id);
  output.push(desiredRoom);
  output.push('node.js');
  output.push('1.1');
  return JSON.stringify(output);
};

if(typeof module !== 'undefined' && module.exports){
  module.exports = MessageBuilder;
}

//Copyright (c) 2015, IDEO 

var isNode = false;
if(typeof module !== 'undefined' && module.exports){
  var TcpReader = require('./TcpReader'),
  MessageParser = require('./MessageParser');
  isNode = true;
}

function MessageHandler(eventFilter) {
  this.tcpReader = new TcpReader(function(message) {
    var parsed = (new MessageParser()).parse(message);
    if (parsed[0] == "event") {
      eventFilter.handle(parsed[2], parsed[3]);
    }
  });
}

MessageHandler.prototype.receive = function(data) {
  this.tcpReader.read(data);
};

if(isNode){
  module.exports = MessageHandler;
}

//Copyright (c) 2015, IDEO 

function MessageParser() {
}

MessageParser.prototype.parse = function(message) {
  try {
    return JSON.parse(message);
  }
  catch(e) {
    console.log("Error Parsing badly formed JSON: " + message);
    console.log(e);
    return [];
  }
};

if(typeof module !== 'undefined' && module.exports){
  module.exports = MessageParser;
}

//Copyright (c) 2015, IDEO 

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

//Copyright (c) 2015, IDEO 

function TcpReader(callback) {
  this.callback = callback;
  this.buffer = "";
}

TcpReader.prototype.read = function(data) {
  this.buffer = this.buffer.concat(data);
  var size = this.payloadSize( this.buffer );
  while ( size > 0 && this.buffer.length >= ( 6 + size ) ) {
    this.consumeOne( size );
    size = this.payloadSize( this.buffer );
  }
};

TcpReader.prototype.payloadSize = function(buffer) {
  if ( this.buffer.length >= 6 ){
    return parseInt( buffer.slice( 0,6 ), 10 );
  }
  else {
    return -1;
  }
};

TcpReader.prototype.consumeOne = function(size) {
  var messageStart = 6;
  var messageEnd = 6 + size;
  this.callback( this.buffer.slice( messageStart, messageEnd ) );
  this.buffer = this.buffer.slice( messageEnd, this.buffer.length );
};

if(typeof module !== 'undefined' && module.exports){
  module.exports = TcpReader;
}
