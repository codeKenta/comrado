/*
 * Kenneth Österholm
 * Final project in course "JavaScript based development "
 * Mid Swede University 2018.
*/

var   express     = require('express'),
      bodyParser  = require('body-parser'),
      path        = require('path'),
      http        = require('http'),
      mongoose    = require('mongoose'),
      app         = express(),
      server      = http.createServer(app),
      passport    = require('passport'),

      usersRoute  = require('./routes/users');

// Set Port
const port = process.env.PORT || '3000';
      app.set('port', port);

// ===========================
// DATABASE CONFIGS ==========
// ===========================

var uri = "mongodb://user:friends4ever@ds123926.mlab.com:23926/comrado_dev";

mongoose.Promise = global.Promise
mongoose.connect(uri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error !! !! !! =====:'));


// Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));


// var JwtStrategy = require('passport-jwt').Strategy,
//     ExtractJwt  = require('passport-jwt').ExtractJwt;

// Passport
app.use(passport.initialize());
app.use(passport.session());

// var opts = {};

// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
//
// opts.secretOrKey = "6laxarienlaxask";
//
// passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
//   console.log("hello? 0");
//   User.findOne({id: jwt_payload.data._id }, (err, user) => {
//     if (err) {
//       console.log("errrrrrror? 1");
//       return done(err, false);
//     }
//     if (user) {
//       console.log("hello? 2");
//       return done(null, user);
//     } else {
//       console.log("hello? 3");
//       return done(null, false);
//     }
//   });
// }));


require('./passport/passport.js')(passport);


// Routes
app.use('/users', usersRoute);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});



var startLog =
"\n+++++++++++++++++++++++\n" +
"+++++ NODE SERVER +++++\n" +
"+++++++ STARTED +++++++\n" +
"+++++++++ " + port +" ++++++++\n" +
"+++++++++++++++++++++++\n";

server.listen(port, () => console.log(startLog));
