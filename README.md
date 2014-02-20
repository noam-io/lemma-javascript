# Javascript Lemma

This library is used to connect javascript applications to Ideo's Noam Server.
It uses web sockets, which can connect up through firewalls and translation layers.

This lemma may be used directly in a web page or within node.

## Web

This section describes the usage of this lemma within an HTML web page.

### Setup

Include lemma.js and jquery in your app

```html
<script type="text/javascript" src="lib/lemma.js"></script>
<script type="text/javascript" src='lib/jquery.min.js'></script>
```

### Usage

See examples/webExample.html for a complete example.

1. Create an instance of the Lemma library.  Choose a unique lemma id.

```javascript
lemma = new Lemma('LEMMA_ID')
```

2. Register callback for events you are interested in. For example, append some html to a div

```javascript
lemma.hears("rpm", function(name, value) {
  //update your page here.
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

### Compiling

Requires Ruby, Bundler, Node, NPM

```bash
$ bundle install # installs sprockets, an asset precompiler
$ npm install    # installs the websockets dependency
$ bundle exec sprockets
$ mv lib/Lemma-*.js lib/lemma.js
```

## Node

This section describes usage of this lemma within a Node application.

### Setup

Require Lemma.js in your app

```javasript
var Lemma = require('./src/Lemma.js')
```

### Usage

See examples/nodeExample.js for a complete example.

To run the example go into the examples/ directory and type `node nodeExample.js`
