// Node.js + Express server backend for ucsdwifi

// Prerequisites - first run:
//   npm install
//
// which will look in package.json and install all dependencies
// (e.g., express)
//
// To start the server, run:
//   node server.js
//
// and open the frontend webpage at http://localhost:3000/petsapp.html

const express = require('express');
const app = express();
const path = require('path');
// const home = require('./static_files/home.html');
// const addSpeed = require('./static_files/addSpeed.html');


// put all of your static files (e.g., HTML, CSS, JS, JPG) in the static_files/
// sub-directory, and the server will serve them from there.
// Learn more: http://expressjs.com/en/starter/static-files.html

app.use(express.static('static_files'));


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
  'Starbucks': {title:'Starbucks', img: 'starbucks.jpg', speed: '51.2 Mbsp'},
  'Geisel Library': {title:'Geisel Library', img: 'geisel.jpg', speed: '48.62 Mbsp'},
  'Center Hall': {title:'Center Hall', img: 'center_hall.jpg', speed: '29.9 Mbsp'},
  'Commuter Lounge': {title:'Commuter Lounge', img: 'commuter_lounge.jpg', speed: '17.3 Mbsp'},
};

// To learn more about server routing:
// Express - Hello world: http://expressjs.com/en/starter/hello-world.html
// Express - basic routing: http://expressjs.com/en/starter/basic-routing.html
// Express - routing: https://expressjs.com/en/guide/routing.html

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/static_files/home.html'));
});

app.get('/addSpeed', function (req, res) {
  res.sendFile(path.join(__dirname + '/static_files/addSpeed.html'));
});

app.get('/getListData', function(req, res) {
  console.log('sending list data: ', fakeListDatabase);
  res.send(fakeListDatabase);
});

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



// start the server at URL: http://localhost:3000/

app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/');
});
