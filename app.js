var express = require('express'),
    app = express()
    path = require('path');

app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, '/public')));

// Serves up index.jade
app.get('/', function (req, res) {
  res.render('index');
});

//- Starts the server and listens on a given port (3000 by default)
var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;
});