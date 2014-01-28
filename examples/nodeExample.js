

var Lemma = require('../src/Lemma.js');


var Object1 = new Lemma('Object1');
Object1.hears('sentFromObject2', function(name, value){
	console.log(name + " : " + value);
});


var Object2 = new Lemma('Object2');
Object2.hears('sentFromObject1', function(name, value){
	console.log(name + " : " + value);
});

Object1.begin('localhost', 8089);
Object2.begin('localhost', 8089);


setInterval(function(){
	Object1.sendEvent('sentFromObject1', 1);
}, 1000);

setInterval(function(){
	Object2.sendEvent('sentFromObject2', 1);
}, 2000);
