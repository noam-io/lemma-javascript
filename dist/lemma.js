'use strict';
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

'use strict';

//Copyright (c) 2015, IDEO

function EventSender(webSocket, builder) {
  this.systemVersion = '1.0';
  this.webSocket = webSocket;
  this.builder = builder;
}

EventSender.prototype.sendEvent = function(name, value) {
  this.sendMessage(this.builder.event(name, value));
};

EventSender.prototype.sendRegister = function(plays, hears) {
  this.sendMessage(this.builder.register(plays, hears, 'web', this.systemVersion));
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

'use strict';

//Copyright (c) 2015, IDEO

//= require MessageBuilder
//= require EventFilter
//= require MessageHandler
//= require EventSender

var isNode = false;

if (typeof module !== 'undefined' && module.exports) {
  isNode = true;
  var EventFilter = require('./EventFilter');
  var MessageBuilder = require('./MessageBuilder');
  var MessageHandler = require('./MessageHandler');
  var EventSender = require('./EventSender');
  /* jshint ignore:start */
  var WebSocket = require('ws');
  /* jshint ignore:end */
}

function Lemma(lemmaId, desiredRoom, debug) {
  this.connected = false;
  this.lemmaId = lemmaId;
  this.desiredRoom = desiredRoom;
  if (debug === 'DEBUG') {
    this.debugMode = true;
  }

  this.messageBuilder = new MessageBuilder(this.lemmaId);
  this.eventFilter = new EventFilter();
  this.messageHandler = new MessageHandler(this.eventFilter);
}

Lemma.prototype.debug = function(str) {
  if (this.debugMode) {
    console.log(str);
  }
};

Lemma.prototype.isConnected = function() { return !!this.connected; };

Lemma.prototype.begin = function(host, port) {
  var _this = this;
  var ws = new WebSocket('ws://' + host + ':' + port.toString() + '/websocket');
  this.ws = ws;

  _this.sender = new EventSender(ws, this.messageBuilder);

  ws.onmessage = function(evt) { _this.messageHandler.receive(evt.data); };

  ws.onclose = function() {
    _this.connected = false;
    _this.debug('socket closed');
    _this.sender = null;
    if (_this.onDisconnectCallback) {
      _this.onDisconnectCallback();
    }
  };

  ws.onopen = function() {
    _this.debug('connected...');
    _this.sender.sendRegister([], _this.eventFilter.events());
    _this.connected = true;
  };

  ws.onerror = function(err) {
    _this.connected = false;
    _this.debug('Web socket Error');
    _this.debug(err);
    _this.sender = null;
    if (_this.onDisconnectCallback) {
      _this.onDisconnectCallback();
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
      this.debug('Error trying to send: ' + e);
      this.sender = null;
      if (this.onDisconnectCallback) {
        this.onDisconnectCallback();
      }
    }
  }
  else {
    this.debug('You must "begin" the lemma before sending a message');
  }
};

Lemma.prototype.end = function() {
  this.ws.close();
};

if (isNode) {
  module.exports = Lemma;
}


'use strict';

//Copyright (c) 2015, IDEO

function MessageBuilder(lemmaId) {
  this.lemmaId = lemmaId;
}

MessageBuilder.prototype.event = function(name, value) {
  var output = [];
  output.push('event');
  output.push(this.lemmaId);
  output.push(name);
  output.push(value);
  return JSON.stringify(output);
};

MessageBuilder.prototype.register = function(plays, hears, deviceId, systemVersion) {
  var output = [];
  output.push('register');
  output.push(this.lemmaId);
  output.push(0);
  output.push(hears);
  output.push(plays);
  output.push(deviceId);
  output.push(systemVersion);
  return JSON.stringify(output);
};

MessageBuilder.prototype.marco = function(desiredRoom) {
  var output = [];
  output.push('marco');
  output.push(this.lemmaId);
  output.push(desiredRoom);
  output.push('node.js');
  output.push('1.1');
  return JSON.stringify(output);
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MessageBuilder;
}

'use strict';
//Copyright (c) 2015, IDEO

var isNode = false;
if (typeof module !== 'undefined' && module.exports) {
  var TcpReader = require('./TcpReader');
  var MessageParser = require('./MessageParser');
  isNode = true;
}

function MessageHandler(eventFilter) {
  this.tcpReader = new TcpReader(function(message) {
    var parsed = (new MessageParser()).parse(message);
    if (parsed[0] === 'event') {
      eventFilter.handle(parsed[2], parsed[3]);
    }
  });
}

MessageHandler.prototype.receive = function(data) {
  this.tcpReader.read(data);
};

if (isNode) {
  module.exports = MessageHandler;
}

'use strict';

//Copyright (c) 2015, IDEO

function MessageParser() {
}

MessageParser.prototype.parse = function(message) {
  try {
    return JSON.parse(message);
  }
  catch (e) {
    console.log('Error Parsing badly formed JSON: ' + message);
    console.log(e);
    return [];
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MessageParser;
}

'use strict';

//Copyright (c) 2015, IDEO

var isNode = false;

if (typeof module !== 'undefined' && module.exports) {
  isNode = true;
  var Datagram = require('dgram');
  var MessageBuilder = require('./MessageBuilder');
  var MessageParser = require('./MessageParser');
}

// I also like to live ... dangerously.
// jscs:disable
/* jshint ignore:start */

// from http://mzl.la/1fFEbu9
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs = Array.prototype.slice.call(arguments, 1);
    var _this = this;
    var fNOP = function() {};

    fBound = function() {
      return _this.apply(this instanceof fNOP && oThis
        ? this
        : oThis,
        aArgs.concat(Array.prototype.slice.call(arguments)));
    };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP(); // jscs

    return fBound;
  };
}
/* jshint ignore:end */
// jscs:enable

function ServerLocator(lemma) {
  this.lemma = lemma;
  this.lemma.onDisconnectCallback = this.beginLocating.bind(this);
  this.broadcastHost = '255.255.255.255';
  this.broadcastPort = 1030;
  this.dialect = 'node.js';
  this.protocolVersion = '2';

  this.webSocketPort = 8089;
}

ServerLocator.prototype.beginLocating = function() {
  var _this = this;
  var lemma = this.lemma;
  var desiredRoom = lemma.desiredRoom;
  var message = new MessageBuilder(lemma.lemmaId).marco(desiredRoom || '');

  var udp = Datagram.createSocket('udp4');

  udp.on('error', function(err) {
    lemma.debug('udp error:\n' + err.stack);
    udp.close();
  });

  udp.on('message', function (message, sender) {
    if(lemma.isConnected()) { return; }
    var parsed = new MessageParser().parse(message);
    if(parsed[0] === 'polo') {
      lemma.debug('got polo from ' + sender.address + ':' + sender.port + ' - ' + message);
      lemma.begin(sender.address, _this.webSocketPort);
    }
  });

  udp.on('listening', function () {
    var address = udp.address();
    lemma.debug('udp listening ' + address.address + ':' + address.port);
  });

  udp.bind(function() {
    udp.setBroadcast(true);
  });

  var fire = function() {
    if (lemma.isConnected()) { return; }

    var sendCallback = function() {
      lemma.debug('sent marco: ' + message);
      setTimeout(fire, 1000);
    };

    udp.send(new Buffer(message), 0, message.length,
             _this.broadcastPort,
             _this.broadcastHost,
             sendCallback);
  };

  setTimeout(fire, 1000);
};

if (isNode) {
  module.exports = ServerLocator;
}

'use strict';
//Copyright (c) 2015, IDEO

function TcpReader(callback) {
  this.callback = callback;
  this.buffer = '';
}

TcpReader.prototype.read = function(data) {
  this.buffer = this.buffer.concat(data);
  var size = this.payloadSize(this.buffer);
  while (size > 0 && this.buffer.length >= 6 + size) {
    this.consumeOne(size);
    size = this.payloadSize(this.buffer);
  }
};

TcpReader.prototype.payloadSize = function(buffer) {
  if (this.buffer.length >= 6) {
    return parseInt(buffer.slice(0, 6), 10);
  }
  else {
    return -1;
  }
};

TcpReader.prototype.consumeOne = function(size) {
  var messageStart = 6;
  var messageEnd = 6 + size;
  this.callback(this.buffer.slice(messageStart, messageEnd));
  this.buffer = this.buffer.slice(messageEnd, this.buffer.length);
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TcpReader;
}
