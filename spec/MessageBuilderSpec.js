describe("MessageBuilder", function() {
  var builder;

  beforeEach(function() {
    builder = new MessageBuilder("lemma_id_1");
  });

  it("builds an event message", function() {
    message = builder.event("event_name", "event_value");
    expect(message).toBeDefined();
    expect(message).toEqual("[\"event\",\"lemma_id_1\",\"event_name\",\"event_value\"]");
  });

  it("builds a registration message", function() {
    message = builder.register(["speed", "rpm"], ["headlights"], "web", "1.0");
    expect(message).toEqual("[\"register\",\"lemma_id_1\",0,[\"headlights\"],[\"speed\",\"rpm\"],\"web\",\"1.0\"]");
  });

  it("builds a marco message", function() {
    message = builder.marco("Desired Room");
    expect(message).toEqual("[\"marco\",\"lemma_id_1\",\"Desired Room\",\"node.js\",\"1.1\"]");
  });
});
