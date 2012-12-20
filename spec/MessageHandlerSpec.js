describe("MessageHandler", function() {
  var handler;
  var lastMessage;
  var eventFilter;

  beforeEach(function() {
    eventFilter = {handle: function(event) {}};
    spyOn(eventFilter, "handle");
    handler = new MessageHandler(eventFilter);
  });

  it("should read a message", function() {
    message = "[\"event\",\"lemma_id_1\",\"speed\",\"55\"]";
    handler.receive("000035" + message);
    expect(eventFilter.handle).toHaveBeenCalledWith("speed", "55")
  });

  it("should ignore non-event messages", function() {
    message = "[\"notit\",\"lemma_id_1\",\"speed\",\"55\"]";
    handler.receive("000035" + message);
    expect(eventFilter.handle).not.toHaveBeenCalled();
  });

  it("should not blow up on bad message", function() {
    handler.receive("000013not_json_test]");
    expect(eventFilter.handle).not.toHaveBeenCalled();
  });

});
