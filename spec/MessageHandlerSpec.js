describe("MessageHandler", function() {
  var handler;
  var lastMessage;

  beforeEach(function() {
    handler = new MessageHandler(function(message) {
      lastMessage = message;
    });
  });

  it("should read a message", function() {
    handler.read("000000")

  });

});
