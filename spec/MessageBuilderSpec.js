describe("MessageBuilder", function() {
  var builder;

  beforeEach(function() {
    builder = new MessageBuilder("lemma_id_1");
  });

  it("should build an event message", function() {
    message = builder.event("event_name", "event_value");
    expect(message).toBeDefined();
    expect(message).toEqual("[\"event\",\"lemma_id_1\",\"event_name\",\"event_value\"]");
  });

});
