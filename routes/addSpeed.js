const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('markers.db');
const speedTest = require('speedtest-net');

// add a speed to the dots table
exports.add = function(req, res) {
  const date = new Date();
  const sqllite_date = date.toISOString();
  // TODO: remove this since it's testing the speed of the server and not
  // the speed of the user's internet, move this or some other method to 
  // client side
  var test = speedTest({maxTime: 5000});

  // will get called if speed test succeeds
  test.on('data', data => {
    db.run(
      'INSERT INTO dots VALUES ($lat, $lng, $speed, $date, $network)',
      // parameters to SQL query:
      {
        $lat: req.body.lat,
        $lng: req.body.lng,
        $speed: data.speeds.download,
        $date: sqllite_date,
        $network: 'PROTECTED' // TODO: insert the real network into database
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
