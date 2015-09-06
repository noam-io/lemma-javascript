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
  } else {
    this.debug('You must "begin" the lemma before sending a message');
  }
};

Lemma.prototype.end = function() {
  this.ws.close();
};

if (isNode) {
  module.exports = Lemma;
}

