'use strict';


var mongoose = require('mongoose'),
GameResult = mongoose.model('GameResult');

exports.listAllGames = function(req, res) {
  GameResult.find({}, function(err, gameResult) {
    if (err)
      res.send(err);
    res.json(gameResult);
  });
};

exports.addGameResult = function(req, res) {
  var newGameResult = new GameResult(req.body);
  newGameResult.save(function(err, gameResult) {
    if (err)
      res.send(err);
    res.json(gameResult);
  });
};