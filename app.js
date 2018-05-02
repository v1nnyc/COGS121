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
app.get('/getplaces', home.places);
app.get('/getnetworks', home.networks);

app.post('/add', addSpeed.add);

app.get('/titlePage', titlePage.view);





app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
