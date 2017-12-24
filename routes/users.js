var express      = require('express'),
    router       = express.Router(),
    mongoose     = require('mongoose'),
    passport     = require('passport'),
    jwt          = require('jsonwebtoken'),
    Queries      = require('./queries'),
    bcrypt       = require('bcryptjs'),
    cloudinary   = require('cloudinary'),
    fs           = require('fs'),
    multer       = require('multer'),
    upload       = multer({ dest: 'fileupload/' }),

    path         = require('path'),
    async        = require('async'),
    cmd          = require('node-cmd'),

    User         = require('../models/user');



// Cloadinary
cloudinary.config({
  cloud_name: 'knetos',
  api_key: '618784128124614',
  api_secret: 'aTNZ78KjLa0dnv1rCJq7bSvudUM'
});

// Uploads file with multer and cloudinary.
// The 'file'-parameter-name is set by angular module ng2-file-upload
router.post('/upload/:userid/:username', upload.single('file'), (req, res, next) => {

  userId = mongoose.Types.ObjectId(req.params.userid);

  cloudinary.uploader.upload(req.file.path, function(result) {

    // Update imagepath in Database
    User.findById(userId, function (err, user) {
      if (err) return handleError(err);

      user.set({ imagepath: result.url });

      user.save(function (err, updatedUser) {
        if (err) return handleError(err);

        console.log(updatedUser);
        // Send response to client
        res.json({success: true, imagepath: result.url});
        });
      });

  }, {
    public_id: req.params.username,
    width: 200,
    height: 200,
    gravity: "face",
    radius: "max",
    crop: "thumb",
    quality: 'auto:best'
  });


});


// Register new user
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
            imagepath: user.imagepath,
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
  let user = {
    username: req.user.username,
    filter: req.user.filter,
    friendRequests: req.user.friendRequests,
    friends: req.user.friends,
    imagepath: req.user.imagepath
  }
  res.json({user: user});
});


// Updates the users password
router.post('/updatepassword', (req, res, next) => {

  let userId = mongoose.Types.ObjectId(req.body.userId);
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;

  User.findById(userId, (err, user) => {
    if (err) throw err;

    // Store the user result in a variable for making
    // it easier to save the updated data to database
    // by using mongoose .save()-method
    let updatingUser = user;

    // Checks if the old password was correctly typed
    User.comparePassword(oldPassword, user.password, (err, isMatch) => {
      if (err) throw err;
      if(isMatch) {

        // Hashes the new password and saves it in database
        bcrypt.hash(newPassword, 10, function(err, hash) {
          updatingUser.password = hash;
          updatingUser.save((err)=>{
            if (err) throw err;
            return res.json({success: true, msg: 'Password successfully updated'});
          });
        });

      } else {
        return res.json({success: false, msg: 'Wrong password'})
      }

    });
  });
});


// Get all users except of the one who is logged in
router.get('/', (req, res, next) => {

  var currentUserId = mongoose.Types.ObjectId(req.query.currentUserId);

  User.find( { _id: { $nin: currentUserId } } ).select('-password -__v')
      .exec(function (err, users) {
        if (err) return next(err);
        res.json(users);
    });

});

// Get all users except of the one who is logged in
router.get('/allusernames', (req, res, next) => {


  User.find({}).select('username -_id')
      .exec(function (err, users) {
        if (err) return next(err);
        res.json(users);
    });

});

// Get one user by id
router.get('/id/:id', (req, res, next) => {

  var currentUserId = mongoose.Types.ObjectId(req.params.id);

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


// Sets the filter which is used for matching active friends
router.put('/setfilter', (req, res, next) => {

  var filter = req.body.filter;
  var currentUserId = mongoose.Types.ObjectId(req.body.currentUserId);

  User.findById(currentUserId, (err, user) => {
    user.filter = [];
    user.filter = user.filter.concat(filter);
    user.save(()=>{
      User.findById(currentUserId).select('-password -__v')
          .exec(function (err, users) {
            if (err) return next(err);
            res.json(users);
        });
    });
  });


});

// Matches friends by filter
router.post('/match', (req, res, next) => {

  var filter = req.body.filter;
  var currentUserId = mongoose.Types.ObjectId(req.body.currentUserId);

  User.find({filter: {$in: filter}, friends: currentUserId}).select('username _id imagepath filter')
      .exec(function (err, users) {
        if (err) return next(err);
        res.json(users);
    });

});


// Send friend request
router.put('/request', (req, res, next) => {

  var requesterId = mongoose.Types.ObjectId(req.body.requesterId);
  var recieverId = mongoose.Types.ObjectId(req.body.recieverId);

  User.findOneAndUpdate({_id: recieverId }, {$push: { friendRequests: requesterId }}, function(err){
    if (err) {
      res.send(err);
    } else {
      res.json({success: true, msg: 'Request was successful'});
    }
  });

});

// Accept friend request
router.put('/request/accept', (req, res, next) => {

  var requesterId = mongoose.Types.ObjectId(req.body.requesterId);
  var accepterId = mongoose.Types.ObjectId(req.body.accepterId);

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

// Deny friend request
router.put('/request/deny', (req, res, next) => {

  var requesterId = mongoose.Types.ObjectId(req.body.requesterId);
  var denierId = mongoose.Types.ObjectId(req.body.denierId);

  User.findOneAndUpdate({_id: denierId }, {$pull: { friendRequests: requesterId } }, function(err){
    if (err) {
      res.send(err);
    } else {
      res.json({success: true, msg: 'Request denied'});
    }
  });

// End friendship between two users
router.post('/endfriendship', (req, res, next) => {
  var currentUserId = mongoose.Types.ObjectId(req.body.currentUserId);
  var friendId = mongoose.Types.ObjectId(req.body.friendId);
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





});

module.exports = router;
