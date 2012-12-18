function MessageBuilder(lemma_id){
  this.lemma_id = lemma_id;
}

MessageBuilder.prototype.event = function(name, value){
 var output = []
 output.push("event");
 output.push(this.lemma_id);
 output.push(name);
 output.push(value);
 return JSON.stringify(output);
};
