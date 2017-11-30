var mongoose = require("mongoose");

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new mongoose.Schema({
  username:   String,
  password:   String,

  filter: [String],

  friends: [
    ObjectId
  ],

  friendRequests: [
    ObjectId
  ]
});

module.exports = mongoose.model("User", UserSchema);
//
// filter: {
//   eat: Boolean,
//   drink: Boolean,
//   game: Boolean,
//   walk: Boolean
// },

//https://stackoverflow.com/questions/6183147/storing-friend-relationships-in-mongodb
