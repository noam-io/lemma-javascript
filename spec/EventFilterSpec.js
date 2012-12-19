describe("EventFilter", function() {
  var filter;
  beforeEach(function() {
    filter = new EventFilter();
  });

  it("should register for an event", function() {
    var callback_event = undefined
    filter.add("speed", function(event) {
      callback_event = event;
    });
    filter.handle({name: "speed", value: "55"})
    expect(callback_event).toEqual({name: "speed", value: "55"})
  });

  it("should register for multiple events", function() {
    var callback_speed = undefined;
    filter.add("speed", function(event) {
      callback_speed = event;
    });

    var callback_rpm = undefined;
    filter.add("rpm", function(event) {
      callback_rpm = event;
    });

    filter.handle({name: "speed", value: "55"})
    filter.handle({name: "rpm", value: "3500"})
    expect(callback_speed).toEqual({name: "speed", value: "55"})
    expect(callback_rpm).toEqual({name: "rpm", value: "3500"})
  });

  it("should register multiple callbacks for an event", function() {
    var callback_event1 = undefined
    filter.add("speed", function(event) {
      callback_event1 = event;
    });

    var callback_event2 = undefined
    filter.add("speed", function(event) {
      callback_event2 = event;
    });

    filter.handle({name: "speed", value: "55"})
    expect(callback_event1).toEqual({name: "speed", value: "55"})
    expect(callback_event2).toEqual({name: "speed", value: "55"})
  });

});
