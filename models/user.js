var mongoose = require("mongoose");

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new mongoose.Schema({
  username:   { type: String, required: true, unique: true },
  password:   { type: String, required: true },

  filter: [String],

  friends: [
    ObjectId
  ],

  friendRequests: [
    ObjectId
  ]
});

module.exports = mongoose.model("User", UserSchema);
