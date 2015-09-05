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
