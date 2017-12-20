/*
 * Kenneth Österholm
 * Final project in course "JavaScript based development "
 * Mid Swede University 2018.
*/

var   express       = require('express'),
      bodyParser    = require('body-parser'),
      path          = require('path'),
      http          = require('http'),
      mongoose      = require('mongoose'),
      app           = express(),
      server        = http.createServer(app),
      passport      = require('passport'),
      cloudinary    = require('cloudinary'),
      multer = require('multer'),
      multerupload = multer({ dest: 'tmp/' }),

      usersRoute    = require('./routes/users'),
      messageRoute  = require('./routes/message');

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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

// Passport
app.use(passport.initialize());
app.use(passport.session());
require('./passport/passport.js')(passport);


// Routes
app.use('/users', usersRoute);
app.use('/message', messageRoute);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});



var startLog =
"\n+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
"+++++++++++++++++++ NODE SERVER +++++++++++++++++++\n" +
"+++++++++++++++++++++ STARTED +++++++++++++++++++++\n" +
"+++++++++++++++++++++++ " + port +" ++++++++++++++++++++++\n" +
"+++++++++++++++++++++++++++++++++++++++++++++++++++\n";

server.listen(port, () => console.log(startLog));
