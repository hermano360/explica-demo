
var express = require('express');
var request = require('request')
var http = require("http")



var app = express();
var port = process.env.PORT || 1234;

app.use(express.static('public'));



app.get('/token', function(req, res) {

  var client_id = 'e9f8db119f1a4493bf9376e73176c9fb'; // Your client id
  var client_secret = '169ed9a5bf9642348e0bd00e816ab635'; // Your secret

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(body.access_token);
    }
  });


});

app.get('/', function(req, res) {
  res.status(200).render('index.js');
});

app.listen(port);
console.log("Listening to port", port);
