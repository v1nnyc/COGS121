// Prerequisites - first run:
//   npm install
//
// which will look in package.json and install all dependencies
// (e.g., express)
//
// To start the server, run:
//   node app.js
//
// and open the frontend webpage at http://localhost:3000/

var express = require('express');
var http = require('http');
const path = require('path');
const app = express();
var handlebars = require('express3-handlebars');




// our routes
const home = require('./routes/home');
const addSpeed = require('./routes/addSpeed');
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

// Sends list data
app.get('/getListData', function(req, res) {
  console.log('sending list data: ', fakeListDatabase);
  res.send(fakeListDatabase);
});

// Sends map marker data
app.get('/getMapData', function(req, res) {
  console.log('sending map data: ', fakeMapDatabase);
  res.send(fakeMapDatabase);
});



// this fake database will be reset when this script restarts. 
// however, as long as the script is running, this database can be modified at will.

const fakeListDatabase = {
  'Starbucks': {title:'Starbucks', img: 'images/starbucks.jpg', speed: '51.2 Mbsp'},
  'Geisel Library': {title:'Geisel Library', img: 'images/geisel.jpg', speed: '48.62 Mbsp'},
  'Center Hall': {title:'Center Hall', img: 'images/center_hall.jpg', speed: '29.9 Mbsp'},
  'Commuter Lounge': {title:'Commuter Lounge', img: 'images/commuter_lounge.jpg', speed: '17.3 Mbsp'},
};


// TODO: make the color category depend on the speed
// TODO: add other fields we want to store (speed, date and time, network) 
const fakeMapDatabase = [
  {
    position: {lat: 32.88121, lng: -117.237449},
	color: 'green'
  }, {
	position: {lat: 32.880097, lng: -117.236431},
	color: 'yellow'
  }, {
	position: {lat: 32.880984, lng: -117.237821},
	color: 'red'
  }, {
	position: {lat: 32.879323, lng: -117.237261},
	color: 'red'
  }
];


app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
