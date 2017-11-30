var express   = require('express'),
    router    = express.Router(),
    mongoose  = require('mongoose'),
    sanitize    = require('mongo-sanitize'),
    User      = require("../models/user");

// Get all users
// Fix so there is only username an id
router.get('/', function(req, res, next){

  User.find(function(err, users){
    if (err) {
      res.send(err);
    } else {
      res.json(users);
    }
  });

});


router.post('/', function(req, res, next){

  var newUser = req.body;

  // Find the logged in users company
  User.create(newUser, function(err, createdUser){

      if(err){
        res.send(err)
      } else {
        res.send(createdUser)
      }
  });
})



router.post('/filter', function(req, res, next){

  var filter = req.body.filter;
  var myID = mongoose.Types.ObjectId(req.body.myID);
  console.log(req.body);

  User.find({filter: {$in: filter}, friends: myID}, function(err, users){
    if (err) {
      res.send(err);
    } else {
      res.json(users);
    }
  });

});


router.put('/request', function(req, res, next){

  var requesterID = mongoose.Types.ObjectId(req.body.requesterID);
  var recieverID = mongoose.Types.ObjectId(req.body.recieverID);


  User.findOneAndUpdate({_id: recieverID }, {$push: { friendRequests: requesterID }}, function(err, reciever){
    if (err) {
      res.send(err);
    } else {
      res.json(reciever);
    }
  });

});


router.put('/accept', function(req, res, next){

  /*

  3. Pusha in acceptersID i requesters friend.
  */

  var requesterID = mongoose.Types.ObjectId(req.body.requesterID);
  var accepterID = mongoose.Types.ObjectId(req.body.accepterID);



  var acceptRequest = function (requesterId, accepterId){
    return new Promise(function(resolve, reject){
      User.findOneAndUpdate({_id: accepterID }, {$pull: { friendRequests: requesterID }, $push: { friends: requesterID } })
      .exec(function(err){
        if(err){
          reject("Something went wrong.")
        } else {
          resolve();
        }
      });
    });
  }

  var fulfillFriendship = function (requesterId, accepterId){
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

  var allPromises = [];

  allPromises.push(acceptRequest(requesterID, accepterID));
  allPromises.push(fulfillFriendship(requesterID, accepterID));

	Promise.all(allPromises).then(function(res){
	 	res.status(200);
	})
	.catch(function(err){
    res.send(err);
	})

  //

  // fungerar första två stegen
  // User.findOneAndUpdate({_id: accepterID }, {$pull: { friendRequests: requesterID }, $push: { friends: requesterID } }, function(err, accepter){
  //   if (err) {
  //     res.send(err);
  //   } else {
  //     res.json(accepter);
  //   }
  // });

});

module.exports = router;

// Find all by friendlist
// https://stackoverflow.com/questions/8303900/mongodb-mongoose-findmany-find-all-documents-with-ids-listed-in-array
// PROMISE example https://jsfiddle.net/nurulnabi/1k2zv9cp/2/
