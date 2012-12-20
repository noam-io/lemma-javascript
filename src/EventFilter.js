function EventFilter() {
  this.callbacks = {}
}

EventFilter.prototype.add = function(name, callback) {
  if (this.callbacks[name] == undefined)
    this.callbacks[name] = [];
  this.callbacks[name].push(callback)
}

EventFilter.prototype.handle = function(name, value) {
  callbacks = this.callbacks[name]
  if (callbacks != undefined) {
    callbacks.forEach(function (callback) {
      callback(name, value);
    });
  }
};


EventFilter.prototype.events = function(event) {
  return Object.keys(this.callbacks)
};
