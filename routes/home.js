// use this library to interface with SQLite databases: https://github.com/mapbox/node-sqlite3
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('markers.db');

/*
 * GET home page.
 */

exports.view = function(req, res){
  res.render('home');
};

exports.markers = function(req, res){
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all(
    'SELECT * FROM markers',
    // callback function to run when the query finishes:
    (err, rows) => {
      //console.log(rows);
      if (rows.length > 0) {
        res.send(rows);
      } else {
        res.send({}); // failed, so return an empty object instead of undefined
      }
    }
  );
};

exports.dots = function(req, res){
  db.all(
    'SELECT * FROM dots',
    // callback function to run when the query finishes:
    (err, rows) => {
      //console.log(rows);
      if (rows.length > 0) {
        res.send(rows);
      } else {
        res.send({}); // failed, so return an empty object instead of undefined
      }
    }
  );
};
