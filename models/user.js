var mongoose  = require("mongoose"),
    bcrypt    = require('bcryptjs');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new mongoose.Schema({
  username:   { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  imagepath: String,

  filter: [String],

  friends: [
    ObjectId
  ],

  friendRequests: [
    ObjectId
  ]
});

module.exports = mongoose.model("User", UserSchema);

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(password, hash, callback) {
  bcrypt.compare(password, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
