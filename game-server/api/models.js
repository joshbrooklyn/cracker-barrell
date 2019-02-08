'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameResultSchema = new Schema({
  name: {
    type: String,
    required: 'Player Name is required'
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  game_result: {
    type: Number,
    required: 'Game Result is required'
  },
  game_history: Array 
});

module.exports = mongoose.model('GameResult', GameResultSchema);