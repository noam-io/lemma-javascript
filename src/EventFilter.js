function EventFilter() {
  this.callbacks = {}
}

EventFilter.prototype.add = function(name, callback) {
  if (this.callbacks[name] == undefined)
    this.callbacks[name] = [];
  this.callbacks[name].push(callback)
}

EventFilter.prototype.handle = function(event) {
  this.callbacks[event.name].forEach(function (callback) {
    callback(event);
  });
}
