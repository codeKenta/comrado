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
    username: req.body.username,
    password: req.body.password,
    imagepath: 'images/profiles/example/default_' + randomImage + '.jpg'
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

// Protected route
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});


// Get all users
router.get('/', (req, res, next) => {

  User.find({}).select('username _id')
      .exec(function (err, users) {
        if (err) return next(err);
        res.json(users);
    });

});



router.post('/filter', (req, res, next) => {

  var filter = req.body.filter;
  var myID = objectID(req.body.myID);

  User.find({filter: {$in: filter}, friends: myID}, (err, users) =>{
    if (err) {
      res.send(err);
    } else {
      res.json(users);
    }
  });

});


router.put('/request', (req, res, next) => {

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


router.put('/accept', (req, res, next) => {

  var requesterID = objectID(req.body.requesterID);
  var accepterID = objectID(req.body.accepterID);

  var allPromises = [];

  allPromises.push(Queries.acceptRequest(requesterID, accepterID));
  allPromises.push(Queries.fulfillFriendship(requesterID, accepterID));

	Promise.all(allPromises).then((res) => {
	 	res.status(200);
	})
	.catch((err) => {
    res.send(err);
	})

});

module.exports = router;
