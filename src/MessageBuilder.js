//Copyright (c) 2014, IDEO 

function MessageBuilder(lemma_id){
  this.lemma_id = lemma_id;
}

MessageBuilder.prototype.event = function(name, value){
  var output = [];
  output.push("event");
  output.push(this.lemma_id);
  output.push(name);
  output.push(value);
  return JSON.stringify(output);
};

MessageBuilder.prototype.register = function(plays, hears, device_id, system_version){
  var output = [];
  output.push('register');
  output.push(this.lemma_id);
  output.push(0);
  output.push(hears);
  output.push(plays);
  output.push(device_id);
  output.push(system_version);
  return JSON.stringify(output);
};

MessageBuilder.prototype.marco = function(desiredRoom){
  var output = [];
  output.push('marco');
  output.push(this.lemma_id);
  output.push(desiredRoom);
  output.push('node.js');
  output.push('1.1');
  return JSON.stringify(output);
};

if(typeof module !== 'undefined' && module.exports){
  module.exports = MessageBuilder;
}
