function TcpReader(callback) {
  this.callback = callback;
  this.buffer = "";
};

TcpReader.prototype.read = function(data) {
  this.buffer = this.buffer.concat(data);
  size = this.payloadSize( this.buffer );
  while ( size > 0 && this.buffer.length >= ( 6 + size ) ) {
    this.consumeOne( size );
    size = this.payloadSize( this.buffer );
  }
}

TcpReader.prototype.payloadSize = function(buffer) {
  if ( this.buffer.length >= 6 ){
    return parseInt( buffer.slice( 0,6 ) );
  }
  else {
    return -1;
  }
}

TcpReader.prototype.consumeOne = function(size) {
  messageStart = 6;
  messageEnd = 6 + size;
  this.callback( this.buffer.slice( messageStart, messageEnd ) );
  this.buffer = this.buffer.slice( messageEnd, this.buffer.length );
}

if(typeof module !== 'undefined' && module.exports){
  module.exports = TcpReader;
}
