//Copyright (c) 2014, IDEO 

var ServerLocator = require('../src/ServerLocator.js');
var Lemma = require('../src/Lemma.js');

var lemma1 = new Lemma('lemma1', "");
lemma1.hears('sentFromlemma2', function(name, value){
  console.log(name + " : " + value);
});

var lemma2 = new Lemma('lemma2', "");
lemma2.hears('sentFromlemma1', function(name, value){
	console.log(name + " : " + value);
});


//// Connect via auto-discovery:
new ServerLocator(lemma1).beginLocating();
new ServerLocator(lemma2).beginLocating();

//// or directly:
// lemma1.begin('localhost', 8089);
// lemma2.begin('localhost', 8089);

var x = 1
setInterval(function(){
  if(lemma1.isConnected()) {
    lemma1.sendEvent('sentFromlemma1', x);
    x++;
  }
}, 1000);

var y = 1
setInterval(function(){
  if(lemma2.isConnected()) {
    lemma2.sendEvent('sentFromlemma2', y);
    y++;
  }
}, 2000);

