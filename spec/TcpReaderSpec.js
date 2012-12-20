describe("TcpReader", function() {
  var handler;
  var lastMessage;
  var calls;

  beforeEach(function() {
    calls = 0
    handler = new TcpReader(function(message) {
      lastMessage = message;
      calls += 1
    });
  });

  it("should read a message", function() {
    handler.read("000001a");
    expect(lastMessage).toEqual("a");
  });

  it("should read a different message", function() {
    handler.read("000001b");
    expect(lastMessage).toEqual("b");
  });

  it("should handle larger messages", function() {
    handler.read("000003the");
    expect(lastMessage).toEqual("the");
  });

  it("should handle piecemeal messages", function() {
    handler.read("000");
    handler.read("004this");
    expect(lastMessage).toEqual("this");
  });

  it("should handle the message trailing the size", function() {
    handler.read("000004t");
    handler.read("hat");
    expect(lastMessage).toEqual("that");
    expect(calls).toEqual(1);
  });

  it("should handle multiple message one after the other", function() {
    handler.read("000004that");
    handler.read("000003bat");
    expect(lastMessage).toEqual("bat");
    expect(calls).toEqual(2);
  });

  it("should handle multiple message together", function() {
    handler.read("000004that000003bat");
    expect(lastMessage).toEqual("bat");
    expect(calls).toEqual(2);
  });


  it("should handle multiple message kindof together", function() {
    handler.read("000004that000003");
    handler.read("bat");
    expect(lastMessage).toEqual("bat");
    expect(calls).toEqual(2);
  });
});
