/* This is the file responsible for communicating between the homepage and the
* server. It is responsible for:
* 1) exporting the view to show the html
* 2) getting the markers from the database and initializing an array with all of
* the info for them.
* 3) getting the dots from the database and initializing an array with all of
* the info for them.
* 4) adding average speeds for all of the markers for each networks
* 5) method for calculating distance (there's one in the common.js but that's
* client side)
*/
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
          markers.forEach(count => {
            //if there wasn't a dot for the marker set the date
            if(typeof count.date == 'undefined'){
              count.date = "No Recorded Data";
            }
            count.distance = 'loading..';
          });
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
        //sorting the dots in reverse order based on their timestamp (newest last)
        dots.sort(function(x, y){
          return y.timestamp - x.timestamp;
        });
        // create array to return, each list will correspond to
        // one network's dots (index 0 is protected, 1 is guest, etc)
        const dotLists = [[], [], []];
        dots.forEach(dot => {
          dotLists[networks[dot.network]].push(dot);
        });
        res.send(dotLists);
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
    marker.speeds = [0, 0, 0];
    marker.counts = [0, 0, 0];
  });

  dots.forEach(dot => {
    markers.forEach(marker => {
      // if the dot is in the marker's radius, add to correct
      // average speed for that marker
      if((calcDist(marker, dot)) < marker.radius) {
        marker.date = dot.date;
        marker.speeds[networks[dot.network]] += dot.speed;
        marker.counts[networks[dot.network]] += 1;
      }
    });
  });

  // for each marker, for each network, divide each speed by each count
  markers.forEach(marker => {
    for (let i = 0; i < marker.speeds.length; i++) {
      if (marker.counts[i] != 0) {
        marker.speeds[i] = marker.speeds[i] / marker.counts[i];
      }
      marker.speeds[i] = marker.speeds[i].toFixed(2);
    }
  });
}

// javascript objects x and y must have fields lat and lng defined
function calcDist(a, b) {
  return Math.sqrt(Math.pow(a.lat - b.lat, 2) + Math.pow(a.lng - b.lng, 2));
}
