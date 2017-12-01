var Queries = {},
    User    = require('../../models/user');


Queries.acceptRequest = function (requesterId, accepterId){
  return new Promise(function(resolve, reject){
    User.findOneAndUpdate({_id: accepterId }, {$pull: { friendRequests: requesterId }, $push: { friends: requesterId } })
    .exec(function(err){
      if(err){
        reject("Something went wrong.")
      } else {
        resolve();
      }
    });
  });
}

Queries.fulfillFriendship = function (requesterId, accepterId){
  return new Promise(function(resolve, reject){
    User.findOneAndUpdate({_id: requesterId }, { $push: { friends: accepterId } })
    .exec(function(err){
      if(err){
        reject("Something went wrong.")
      } else {
        resolve();
      }
    });
  });
}


module.exports = Queries;
