var express   = require('express'),
    router    = express.Router(),
    mongoose  = require('mongoose'),
    objectID  = require('objectid'),
    sanitize  = require('mongo-sanitize'),
    passport  = require('passport'),
    jwt       = require('jsonwebtoken'),
    Queries   = require('./queries'),
    User      = require('../models/user');


router.post('/register', (req, res, next) => {
  let newUser = new User({
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({success: false, msg: 'The application failed to register the user'})
    } else {
      res.json({success: true, msg: 'New user registered'});
    }
  });
});

router.post('/authenticate', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  // User.findOne({username: username}, callback);
  // User.getUserByUsername(username,
  User.findOne({username: username}, (err, user) => {
    if (err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if(isMatch) {
        const token = jwt.sign({ data: user }, '6laxarienlaxask', {
          expiresIn: 604800
        });

        res.json({
          success: true,
          token: 'JWT ' + token,
          user: {
            id: user._id,
            username: user.username
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password or username'})
      }

    });
  });
});

// Protected route
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  console.log("jasså?");
  res.json({user: req.user});
});

// Get all users
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
