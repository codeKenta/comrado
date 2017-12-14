var mongoose  = require("mongoose"),
    User      = require('./user');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ChatSchema = new mongoose.Schema({

  sender:
  {
    type: ObjectId,
    ref: User
  },

  reciever:
  {
    type: ObjectId,
    ref: User
  },

  message: String,

  sent: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Chat", ChatSchema);
