var   express = require('express'),
      bodyParser = require('body-parser'),
      path = require('path'),
      http = require('http'),
      mongoose = require('mongoose'),
      app = express(),
      server = http.createServer(app);

// Set Port
const port = process.env.PORT || '3000';
      app.set('port', port);

// ===========================
// DATABASE CONFIGS ==========
// ===========================

var uri = "mongodb://user:pepperoni@ds117156.mlab.com:17156/moment-angular";

mongoose.Promise = global.Promise
mongoose.connect(uri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error !! !! !! =====:'));


// Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));


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
