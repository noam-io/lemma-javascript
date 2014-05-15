//Copyright (c) 2014, IDEO 

function MessageParser() {
}

MessageParser.prototype.parse = function(message) {
  try {
    return JSON.parse(message);
  }
  catch(e) {
    console.log("Error Parsing badly formed JSON: " + message);
    console.log(e);
    return [];
  }
};

if(typeof module !== 'undefined' && module.exports){
  module.exports = MessageParser;
}
