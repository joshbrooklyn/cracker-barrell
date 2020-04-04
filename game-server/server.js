var express = require('express'),
  app = express(),
  port = process.env.PORT || 3001,
  mongoose = require('mongoose'),
  GameResult = require('./api/models'), //created model loading here
  bodyParser = require('body-parser');
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://josh:blanc0$@localhost/CrackerBarrelGameHistory?authSource=admin', {useNewUrlParser: true}); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var routes = require('./api/routes'); //importing route
routes(app); //register the route


app.listen(port);


console.log('Cracker Barrel RESTful API server started on: ' + port);