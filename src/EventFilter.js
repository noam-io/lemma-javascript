//Copyright (c) 2014, IDEO 

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
