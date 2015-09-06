/* global EventFilter */
'use strict';
describe("EventFilter", function() {
  var filter;
  beforeEach(function() {
    filter = new EventFilter();
  });

  it("should register for an event", function() {
    var callback_event = undefined
    filter.add("speed", function(event) { callback_event = event; });
    filter.handle("speed", "55")
    expect(callback_event).toEqual("speed", "55")
  });

  it("should handle an event no one has registered for", function() {
    var callback_event = undefined
    filter.handle("speed", "55")
    expect(callback_event).toBeUndefined();
  });

  it("should register for multiple events", function() {
    var callback_speed = undefined;
    filter.add("speed", function(event) { callback_speed = event; });

    var callback_rpm = undefined;
    filter.add("rpm", function(event) { callback_rpm = event; });

    filter.handle("speed", "55")
    filter.handle("rpm", "3500")
    expect(callback_speed).toEqual("speed", "55")
    expect(callback_rpm).toEqual("rpm", "3500")
  });

  it("should register multiple callbacks for an event", function() {
    var callback_event1 = undefined
    filter.add("speed", function(event) { callback_event1 = event; });

    var callback_event2 = undefined
    filter.add("speed", function(event) { callback_event2 = event; });

    filter.handle("speed", "55")
    expect(callback_event1).toEqual("speed","55")
    expect(callback_event2).toEqual("speed", "55")
  });

  it("should list registered events", function() {
    filter.add("speed");
    filter.add("rpm");

    expect(filter.events()).toContain("speed")
    expect(filter.events()).toContain("rpm")
  });

});
