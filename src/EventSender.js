//Copyright (c) 2014, IDEO 

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
