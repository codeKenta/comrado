var express   = require('express'),
    router    = express.Router(),
    mongoose  = require('mongoose'),
    passport  = require('passport'),
    Queries   = require('./queries'),
    User      = require('../models/user');
    Chat      = require('../models/chat');

// router.get('/', (req, res, next) => {
//   res.send("message work");
// });


router.post('/conversation', (req, res, next) => {

  let user1 = mongoose.Types.ObjectId(req.body.user1);
  let user2 = mongoose.Types.ObjectId(req.body.user2);

  Chat.find( { $or: [
      { sender : user2, reciever: user1 },
      {sender : user1, reciever: user2 }
    ]} )
      .select('-__v')
      .sort({sent: 'desc'})
      .exec(function (err, conversation) {
        if (err) return next(err);
        res.json(conversation);
    });

});

router.post('/send', (req, res, next) => {

  data = {
    sender: mongoose.Types.ObjectId(req.body.sender),
    reciever: mongoose.Types.ObjectId(req.body.reciever),
    message: req.body.message
  }

  newMessage = new Chat(data);

  newMessage.save((err, createdMessage) => {
    if (err) {
      res.json({success: false, msg: 'Message was could not be sent'});
    } else {
      res.json({success: true, msg: 'Message was successfully sent'});
    }
  });

});





module.exports = router;
