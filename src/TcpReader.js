//Copyright (c) 2014, IDEO 

function TcpReader(callback) {
  this.callback = callback;
  this.buffer = "";
}

TcpReader.prototype.read = function(data) {
  this.buffer = this.buffer.concat(data);
  var size = this.payloadSize( this.buffer );
  while ( size > 0 && this.buffer.length >= ( 6 + size ) ) {
    this.consumeOne( size );
    size = this.payloadSize( this.buffer );
  }
};

TcpReader.prototype.payloadSize = function(buffer) {
  if ( this.buffer.length >= 6 ){
    return parseInt( buffer.slice( 0,6 ), 10 );
  }
  else {
    return -1;
  }
};

TcpReader.prototype.consumeOne = function(size) {
  var messageStart = 6;
  var messageEnd = 6 + size;
  this.callback( this.buffer.slice( messageStart, messageEnd ) );
  this.buffer = this.buffer.slice( messageEnd, this.buffer.length );
};

if(typeof module !== 'undefined' && module.exports){
  module.exports = TcpReader;
}
