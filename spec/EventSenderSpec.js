describe("EventSender", function() {
  var ws;
  var builder;
  var sender;
  beforeEach(function() {
    ws = { send: function(data) { } }
    spyOn(ws, "send")
    builder = { event: function(name, value) {return "message";},
      register: function( plays,  hears, device_id, system_version){return "register"}
    }
    spyOn(builder, "event").andCallThrough();
    spyOn(builder, "register").andCallThrough();

    sender = new EventSender(ws, builder);
  });

  it("should send at event", function() {
    sender.sendEvent("speed", "55");
    expect(builder.event).toHaveBeenCalledWith("speed", "55");
    expect(ws.send).toHaveBeenCalledWith("000007message");
  });

  it("should send a registration message", function() {
    sender.sendRegister(["e1", "e2"], ["e3", "e4"]);
    expect(builder.register).toHaveBeenCalledWith(["e1", "e2"], ["e3", "e4"], "web", sender.systemVersion);
    expect(ws.send).toHaveBeenCalledWith("000008register");
  });

});
