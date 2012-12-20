function EventSender(web_socket, builder) {
  this.web_socket = web_socket
  this.builder = builder
};

EventSender.prototype.sendEvent = function(name, value){
  var message = this.builder.event(name, value);
  this.web_socket.send(this.zeroPad(message.length, 6) + message);
};

EventSender.prototype.zeroPad = function(number, width) {
  return (new Array(width + 1 - number.toString().length)).join('0') + number;
}
