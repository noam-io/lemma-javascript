describe("EventSender", function() {
  var ws;
  var builder;
  var sender;
  beforeEach(function() {
    ws = { send: function(data) { } }
    spyOn(ws, "send")
    builder = { event: function(name, value) {return "message";} }
    spyOn(builder, "event").andCallThrough();

    sender = new EventSender(ws, builder);
  });

  it("should send at event", function() {
    sender.sendEvent("speed", "55");
    expect(builder.event).toHaveBeenCalledWith("speed", "55");
    expect(ws.send).toHaveBeenCalledWith("000007message");
  });

});
