const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('markers.db');

const networks = {
  PROTECTED: 0,
  GUEST: 1,
  RESNET: 2
};

/* GET home page. */
exports.view = function(req, res) {
  res.render('home');
};

exports.markers = function(req, res) {
  db.all(
    'SELECT * FROM markers',
    // callback function to run when the query finishes:
    (err, markers) => {
      if (markers.length > 0) {
        db.all('Select * FROM dots', (err, dots) => {
          addAverageSpeeds(dots, markers);
          res.send(markers);
        });
      } else {
        res.send({}); // failed, return an empty object instead of undefined
      }
    }
  );
};

exports.dots = function(req, res) {
  db.all(
    'SELECT * FROM dots',
    // callback function to run when the query finishes:
    (err, dots) => {
      if (dots.length > 0) {
        res.send(dots);
      } else {
        res.send({}); // failed, return an empty object instead of undefined
      }
    }
  );
};

// modifies markers so that they have a list of average speeds for each network
function addAverageSpeeds(dots, markers) {
  // add empty speeds and num dots to each marker for each network
  markers.forEach(marker => {
    marker.networkSpeeds = [0, 0, 0];
    marker.networkCounts = [0, 0, 0];
  });

  dots.forEach(dot => {
    markers.forEach(marker => {
      // if the dot is in the marker's radius, add to correct 
      // average speed for that marker
      if((calcDist(marker, dot)) < marker.radius) {
        marker.networkSpeeds[networks[dot.network]] += dot.speed;
        marker.networkCounts[networks[dot.network]] += 1;
      }
    });
  });

  // for each marker, for each network, divide each speed by each count
  markers.forEach(marker => {
    for (let i = 0; i < marker.networkSpeeds.length; i++) {
      if (marker.networkCounts[i] != 0) {
        marker.networkSpeeds[i] = marker.networkSpeeds[i] / marker.networkCounts[i];
      }
    }
  });
}

// javascript objects x and y must have fields lat and lng defined
function calcDist(a, b) {
  return Math.sqrt(Math.pow(a.lat - b.lat, 2) + Math.pow(a.lng - b.lng, 2));
}
