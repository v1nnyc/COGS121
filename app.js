// Prerequisites - first run:
//   npm install
//
// which will look in package.json and install all dependencies
// (e.g., express)
//
// To start the server, run:
//   node server.js
//
// and open the frontend webpage at http://localhost:3000/

var express = require('express');
var http = require('http');
const path = require('path');
const app = express();
var handlebars = require('express3-handlebars')



// our routes
const home = require('./routes/home');
const addSpeed = require('./routes/addSpeed')
const titlePage = require('./routes/titlePage');



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('IxD secret key'));
app.use(express.session());
app.use(app.router);

// put all of your static files (e.g., HTML, CSS, JS, JPG) in the public/
// sub-directory, and the server will serve them from there.
// Learn more: http://expressjs.com/en/starter/static-files.html

app.use(express.static(path.join(__dirname, 'public')));



// To learn more about server routing:
// Express - Hello world: http://expressjs.com/en/starter/hello-world.html
// Express - basic routing: http://expressjs.com/en/starter/basic-routing.html
// Express - routing: https://expressjs.com/en/guide/routing.html

app.get('/', home.view);

app.get('/addSpeed', addSpeed.view);

app.get('/titlePage', titlePage.view);

//will print out database to console (transfered from previous repo)
app.get('/getListData', function(req, res) {
  console.log('sending list data: ', fakeListDatabase);
  res.send(fakeListDatabase);
});



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// simulates a database in memory, to make this example simple and
// self-contained (so that you don't need to set up a separate database).
// note that a real database will save its data to the hard drive so
// that they become persistent, but this fake database will be reset when
// this script restarts. however, as long as the script is running, this
// database can be modified at will.
//
// const fakeDatabase = {
//   'Philip': {job: 'professor', pet: 'cat.jpg'},
//   'John': {job: 'student',   pet: 'dog.jpg'},
//   'Carol': {job: 'engineer',  pet: 'bear.jpg'}
// };
const fakeListDatabase = {
  'Starbucks': {title:'Starbucks', img: 'images/starbucks.jpg', speed: '51.2 Mbsp'},
  'Geisel Library': {title:'Geisel Library', img: 'images/geisel.jpg', speed: '48.62 Mbsp'},
  'Center Hall': {title:'Center Hall', img: 'images/center_hall.jpg', speed: '29.9 Mbsp'},
  'Commuter Lounge': {title:'Commuter Lounge', img: 'images/commuter_lounge.jpg', speed: '17.3 Mbsp'},
};

// // KEEPING THIS FOR REFERENCE FOR NOW
// app.get('/users', (req, res) => {
//   const allUsernames = Object.keys(fakeDatabase); // returns a list of object keys
//   console.log('allUsernames is:', allUsernames);
//   res.send(allUsernames);
// });
//
// // KEEPING THIS FOR REFERENCE FOR NOW
// app.get('/users/:userid', (req, res) => {
//   const nameToLookup = req.params.userid; // matches ':userid' above
//   const val = fakeDatabase[nameToLookup];
//   console.log(nameToLookup, '->', val); // for debugging
//   if (val) {
//     res.send(val);
//   } else {
//     res.send({}); // failed, so return an empty object instead of undefined
//   }
// });

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
