# Javascript Lemma

This library is used to connect javascript applications to Ideo's Noam Server.
It uses web sockets, which can connect up through firewalls and translation layers.

This lemma may be used directly in a web page or within node.


## Web

This section describes the usage of this lemma within an HTML web page.

### Building

This step is necessary if you want a single file to require on your web page.
It's not necessary if you want to use Node.js or are fine including all the
files you need by yourself. Requires [Grunt](http://gruntjs.com/).

**Note:** Prebuilt concatenated and minified versions of the library are distributed in the `dist` folder of this repository

```bash
$ npm install
$ bower install
$ grunt
```

### Setup

Include `lemma.js` your app:

```html
<script type="text/javascript" src="dist/lemma.js"></script>
```

### Usage

See examples/webExample.html for a complete example.

**Note:** these examples use jQuery -  in your HTML page

1. Create an instance of the Lemma library.  Choose a unique lemma id.

```javascript
lemma = new Lemma('LEMMA_ID')
```

2. Register callback for events you are interested in. For example, append some html to a div

```javascript
lemma.hears("rpm", function(name, value) {
  //update your page here (using jQuery).
  $("div#msg").append("<p>" + name + ":&nbsp;" + value +  "</p>");
});
```

3. Begin lemma-ing. Use the ip address and web socket port of the Noam Server

```javascript
lemma.begin('10.0.1.29', 8080);
```

4. Send a Noam event when you want to update something, for example in a click binding

```javascript
$("button#rpm").click(function() {
  lemma.sendEvent("rpm", $("#rpmValue").val())
});
```

## Node

This section describes usage of this lemma within a Node application.

### Building

```bash
$ npm install    # installs the websockets dependency
```

### Setup

Require Lemma.js in your app

```javasript
var Lemma = require('./src/Lemma.js')
```

### Usage

See examples/nodeExample.js for a complete example.

To run the example go into the examples/ directory and type `node nodeExample.js`


## Developing

After running `npm install`, you'll have a local copy of jshint to check your
JavaScript for things like using globals and other such accidents. To run that, it's just:

```bash
./node_modules/jshint/bin/jshint ./src
```

