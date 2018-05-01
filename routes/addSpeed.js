// use this library to interface with SQLite databases: https://github.com/mapbox/node-sqlite3
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('markers.db');


// GET addSpeed page
exports.view = function(req, res) {
  res.render('addSpeed');
};

// add a speed to the database
// TODO: this method should also update any entries in the places
// table which are close enough to this location by adding it into 
// that place's average speed
exports.add = function(req, res) {
  const date = new Date();
  const sqllite_date = date.toISOString();

  db.run(
    'INSERT INTO networks VALUES ($lat, $lng, $speed, $date)',
    // parameters to SQL query:
    {
      $lat: req.body.lat,
      $lng: req.body.lng,
      $speed: req.body.speed,
      $date: sqllite_date,
    },
    // callback function to run when the query finishes:
    (err) => {
      if (err) {
        res.send({success: false});
      } else {
        res.send({success: true});
      }
    }
  );
};