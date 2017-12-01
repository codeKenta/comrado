var express   = require('express'),
    router    = express.Router(),
    mongoose  = require('mongoose'),
    objectID  = require('objectid'),
    sanitize  = require('mongo-sanitize'),

    Queries   = require('./queries'),
    User      = require('../models/user');

// Get all users
// Fix so there is only username an id
router.get('/', function(req, res, next){

  User.find({}).select('username _id')
      .exec(function (err, users) {
        if (err) return next(err);
        res.json(users);
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
  var myID = objectID(req.body.myID);
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

  var requesterID = objectID(req.body.requesterID);
  var recieverID = objectID(req.body.recieverID);

  User.findOneAndUpdate({_id: recieverID }, {$push: { friendRequests: requesterID }}, function(err, reciever){
    if (err) {
      res.send(err);
    } else {
      res.json(reciever);
    }
  });

});


router.put('/accept', function(req, res, next){

  var requesterID = objectID(req.body.requesterID);
  var accepterID = objectID(req.body.accepterID);

  var allPromises = [];

  allPromises.push(Queries.acceptRequest(requesterID, accepterID));
  allPromises.push(Queries.fulfillFriendship(requesterID, accepterID));

	Promise.all(allPromises).then(function(res){
	 	res.status(200);
	})
	.catch(function(err){
    res.send(err);
	})

});

module.exports = router;

// Find all by friendlist
// https://stackoverflow.com/questions/8303900/mongodb-mongoose-findmany-find-all-documents-with-ids-listed-in-array
// PROMISE example https://jsfiddle.net/nurulnabi/1k2zv9cp/2/
