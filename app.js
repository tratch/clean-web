var express = require('express');
var app = express();

var path = require('path');

app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function (req, res) {
  res.render('index', {
    title: 'Boston CleanWeb Hackathon 2015 Sample App'
  });
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});