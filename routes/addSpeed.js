/* This file is responsible for adding speed information to the database. It
* calls the network speed API and inserts the resulting info into the database
* as a new dot value.
*/
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('markers.db');
const speedTest = require('speedtest-net');

// add a speed to the dots table
exports.add = function(req, res) {
  const date = new Date();
  const sqllite_date = date.toISOString();
  var test = speedTest({maxTime: 5000});

  // will get called if speed test succeeds
  test.on('data', data => {
    console.log(req.body);
    db.run(
      'INSERT INTO dots VALUES ($lat, $lng, $speed, $timestamp, $date, $network)',
      // parameters to SQL query:
      {
        $lat: req.body.pos.lat,
        $lng: req.body.pos.lng,
        $speed: data.speeds.download,
        $timestamp: date,
        $date: date.toDateString(),
        $network: req.body.network
      },
      // callback function to run when the query finishes:
      (err) => {
        if (err) {
          res.send({success: false, speed: 0});
        } else {
          res.send({success: true, speed: data.speeds.download});
        }
      }
    );
  });

  // will get called if speed tests fails
  test.on('error', err => {
    console.log('Speed test error:');
    console.error(err);
    res.send({success: false, speed: 0});
  });
};
