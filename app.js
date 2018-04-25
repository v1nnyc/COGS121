
/**
 * Module dependencies.
 * TO RUN NODE APP.JS
 */

var express = require('express');
var http = require('http');
const path = require('path');
const app = express();
var handlebars = require('express3-handlebars')

// our routes
var home = require('./routes/home');
var addSpeed = require('./routes/addSpeed')



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
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//fake database (transfered from previous repo)
const fakeListDatabase = {
  'Starbucks': {title:'Starbucks', img: 'images/starbucks.jpg', speed: '51.2 Mbsp'},
  'Geisel Library': {title:'Geisel Library', img: 'images/geisel.jpg', speed: '48.62 Mbsp'},
  'Center Hall': {title:'Center Hall', img: 'images/center_hall.jpg', speed: '29.9 Mbsp'},
  'Commuter Lounge': {title:'Commuter Lounge', img: 'images/commuter_lounge.jpg', speed: '17.3 Mbsp'},
};

app.get('/', home.view);

app.get('/addSpeed', addSpeed.view);

//will print out database to console (transfered from previous repo)
app.get('/getListData', function(req, res) {
  console.log('sending list data: ', fakeListDatabase);
  res.send(fakeListDatabase);
});
// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
