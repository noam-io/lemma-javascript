//Copyright (c) 2014, IDEO 

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
