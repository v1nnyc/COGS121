// run this once to create the initial database as the pets.db file
//   node create_database.js

// to clear the database, simply delete the pets.db file:
//   rm markers.db

const sqlite3 = require('sqlite3');
const markers = new sqlite3.Database('markers.db');
//lat long speed date
//name image lat long

// run each database statement *serially* one after another
// (if you don't do this, then all statements will run in parallel,
//  which we don't want)
markers.serialize(() => {
  markers.run("CREATE TABLE networks (lat FLOAT, lng FLOAT, speed FLOAT, date DATE)");
  markers.run("CREATE TABLE places (lat FLOAT, lng FLOAT, name TEXT, image TEXT, speed FLOAT)");

  markers.run("INSERT INTO networks VALUES('32.88121', '-117.237449', '1.0', '0')");
  markers.run("INSERT INTO networks VALUES('32.880097', '-117.236431', '1.0', '0')");
  markers.run("INSERT INTO networks VALUES('32.880984', '-117.237821', '1.0', '0')");
  markers.run("INSERT INTO networks VALUES('32.879323', '-117.237261', '1.0', '0')");

  markers.run("INSERT INTO places VALUES('32.880236',  '-117.236392', 'Starbucks', 'images/starbucks.jpg','51.2')");
  markers.run("INSERT INTO places VALUES('32.881130',  '-117.237556', 'Geisel Library', 'images/geisel.jpg','48.62')");
  markers.run("INSERT INTO places VALUES('32.877879',  '-117.237243', 'Center Hall', 'images/center_hall.jpg','29.9')");
  markers.run("INSERT INTO places VALUES('32.880153',  '-117.236093', 'Commuter Lounge', 'images/commuter_lounge.jpg','17.3')");
});

markers.close();
