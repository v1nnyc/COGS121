// run this once to create the initial database as the pets.db file
//   node create_database.js

// to clear the database, simply delete the pets.db file:
//   rm markers.db

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('markers.db');

db.serialize(() => {
  db.run("CREATE TABLE dots (lat FLOAT, lng FLOAT, speed FLOAT, date DATE)");
  db.run("CREATE TABLE markers (lat FLOAT, lng FLOAT, name TEXT, image TEXT, speed FLOAT, dots INT, radius INT)");

  db.run("INSERT INTO dots VALUES('32.88121', '-117.237449', '75.11', '0')");
  db.run("INSERT INTO dots VALUES('32.880097', '-117.236431', '10.34', '0')");
  db.run("INSERT INTO dots VALUES('32.880984', '-117.237821', '36.12', '0')");
  db.run("INSERT INTO dots VALUES('32.879323', '-117.237261', '4.5', '0')");

  db.run("INSERT INTO markers VALUES('32.880236',  '-117.236392', 'Starbucks', 'images/starbucks.jpg','51.2', '0', '2')");
  db.run("INSERT INTO markers VALUES('32.881130',  '-117.237556', 'Geisel Library', 'images/geisel.jpg','48.62', '0', '2')");
  db.run("INSERT INTO markers VALUES('32.877879',  '-117.237243', 'Center Hall', 'images/center_hall.jpg','29.9', '0', '2')");
  db.run("INSERT INTO markers VALUES('32.880153',  '-117.236093', 'Commuter Lounge', 'images/commuter_lounge.jpg','17.3', '0', '2')");
});

db.close();
