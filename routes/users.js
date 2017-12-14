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
  let randomImage = Math.floor(Math.random() * 10) + 1;
  let newUser = new User({
    username: req.body.username.toLowerCase(),
    password: req.body.password,
    imagepath: 'images/profiles/example/default_' + randomImage + '.jpg',
    friends: [
      '5a2c596132ea4619a103dafe'
    ]
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
  var username = req.body.username.toLowerCase();
  var password = req.body.password;

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
            username: user.username,
            friendRequests: user.friendRequests,
            friends: user.friends,
            filter: user.filter
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password or username'})
      }

    });
  });
});

// Protected route, gets user detail of logged in user
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});


// Get all users except of the one who is logged in
router.get('/', (req, res, next) => {

  var currentUserId = objectID(req.query.currentUserId);

  User.find( { _id: { $nin: currentUserId } } ).select('-password -__v')
      .exec(function (err, users) {
        if (err) return next(err);
        res.json(users);
    });

});

// Get one user by id
router.get('/id/:id', (req, res, next) => {

  var currentUserId = objectID(req.params.id);

  User.findById(currentUserId).select('-password -__v')
      .exec(function (err, users) {
        if (err) return next(err);
        res.json(users);
    });

});

// Get one user by username
router.get('/username/:username', (req, res, next) => {

  var username = req.params.username;

  User.findOne({username: username}).select('-password -__v')
      .exec(function (err, users) {
        if (err) return next(err);
        res.json(users);
    });

});

// Get users  by array of IDs
router.post('/ids', (req, res, next) => {

  usersIdArray = req.body;

  User.find( { _id: { $in: usersIdArray } } ).select('username _id imagepath')
      .exec(function (err, users) {
        if (err) return next(err);
        res.json(users);
    });

});



router.post('/filter', (req, res, next) => {

  var filter = req.body.filter;
  var myId = objectID(req.body.myId);

  User.find({filter: {$in: filter}, friends: myId}, (err, users) =>{
    if (err) {
      res.send(err);
    } else {
      res.json(users);
    }
  });

});

router.put('/request', (req, res, next) => {

  var requesterId = objectID(req.body.requesterId);
  var recieverId = objectID(req.body.recieverId);

  User.findOneAndUpdate({_id: recieverId }, {$push: { friendRequests: requesterId }}, function(err){
    if (err) {
      res.send(err);
    } else {
      res.json({success: true, msg: 'Request was successful'});
    }
  });

});

router.put('/request/accept', (req, res, next) => {

  var requesterId = objectID(req.body.requesterId);
  var accepterId = objectID(req.body.accepterId);

  var allPromises = [];

  allPromises.push(Queries.acceptRequest(requesterId, accepterId));
  allPromises.push(Queries.fulfillFriendship(requesterId, accepterId));

	Promise.all(allPromises).then((res) => {
	 	res.status(200);
	})
	.catch((err) => {
    res.send(err);
	})

});

// End friendship between two users
router.put('/endfriendship', (req, res, next) => {
    console.log(req.body);
  var currentUserId = objectID(req.body.currentUserId);
  var friendId = objectID(req.body.friendId);
  let users = [];
  users.push(currentUserId, friendId );

  User.updateMany(
      { _id: { $in: users }},
      { $pullAll: { friends: users }},
       function(err){
    if (err) {
      res.send(err);
    } else {
      res.json({success: true, msg: 'Friendship was successfully ended'});
    }
  });

});

router.put('/request/deny', (req, res, next) => {

  var requesterId = objectID(req.body.requesterId);
  var denierId = objectID(req.body.denierId);

  User.findOneAndUpdate({_id: denierId }, {$pull: { friendRequests: requesterId } }, function(err){
    if (err) {
      res.send(err);
    } else {
      res.json({success: true, msg: 'Request denied'});
    }
  });



});

module.exports = router;
