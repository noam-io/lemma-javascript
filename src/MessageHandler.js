function MessageHandler(eventFilter) {
  this.tcpReader = new TcpReader(function(message) {
    try {
      parsed = JSON.parse(message);
    }
    catch(e) {
      console.log("Error Parsing badly formed JSON: " + message)
      console.log(e);
    }
    if ( parsed[0] == "event" ) {
      eventFilter.handle(parsed[2], parsed[3]);
    }
  });
};

MessageHandler.prototype.receive = function(data) {
  this.tcpReader.read(data);
};
