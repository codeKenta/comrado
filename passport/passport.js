var JwtStrategy  = require('passport-jwt').Strategy,
    ExtractJwt   = require('passport-jwt').ExtractJwt,
    User         = require('../models/user');

module.exports = function(passport){

  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = "6laxarienlaxask";

  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log(jwt_payload);
    User.findOne({id: jwt_payload.data._id }, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
}








  //
  //
  //
