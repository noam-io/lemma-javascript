function Lemma(lemmaId) {
  this.messageBuilder = new MessageBuilder(lemmaId);
  this.eventFilter = new EventFilter();
};

Lemma.prototype.debug = function(str){ console.log(str);};

Lemma.prototype.begin = function(host, port) {
  var lemma = this
  ws = new WebSocket("ws://" + host + ":" + port.toString() + "/websocket");
  lemma.sender = new EventSender(ws, this.messageBuilder);

  ws.onmessage = function(evt) { $("#msg").append("<p>"+evt.data+"</p>"); };
  ws.onclose = function() { debug("socket closed"); };
  ws.onopen = function() {
    console.log("connected...");
    lemma.sender.sendRegister([], lemma.eventFilter.events());
  };
};

Lemma.prototype.hears = function(name, callback) {
  this.eventFilter.add(name, callback);
};

Lemma.prototype.sendEvent = function(name, value) {
  if (this.sender != undefined) {
    this.sender.sendEvent(name, value);
  }
  else {
    this.debug("You must 'begin' the lemma before sending a message");
  }
};
