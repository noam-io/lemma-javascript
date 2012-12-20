#Web Lemma
This library is used to connect javascript applications to Ideo's Noam Server.
It uses web sockets which can connect up through firewalls and translation layers.

###Setup
  Include lemma.js and jquery in your app

        <script type="text/javascript" src="lib/lemma.js"></script>
        <script type="text/javascript" src='lib/jquery.min.js'></script>
###Usage
See example.html for a complete example.

1. Create an instance of the Lemma library.  Choose a unique lemma id.

        lemma = new Lemma('LEMMA_ID')

2. Register callback for events you are interested in. For example, append some html to a div

        lemma.hears("rpm", function(name, value) {
          //update your page here.
          $("div#msg").append("<p>" + name + ":&nbsp;" + value +  "</p>");
        });

3. Begin lemma-ing. Use the ip address and web socket port of the Noam Server

        lemma.begin('10.0.1.29', 8080);

4. Send a Noam event when you want to update something, for example in a click binding

        $("button#rpm").click(function() {
          lemma.sendEvent("rpm", $("#rpmValue").val())
        });

###compiling
requires ruby and the sprockets gem

        $gem install sprockets
        $sprockets
        $mv lib/Lemma-*.js lib/lemma.js

