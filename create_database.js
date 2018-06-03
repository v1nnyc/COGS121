// run this once to create the initial database as the pets.db file
//   node create_database.js

// to clear the database, simply delete the pets.db file:
//   rm markers.db

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('markers.db');

db.serialize(() => {
  /* NOTE: network should be one of "PROTECTED", "GUEST", or "RESNET" */
  db.run("CREATE TABLE dots (lat FLOAT, lng FLOAT, speed FLOAT, timestamp TEXT, date DATE, network TEXT)");

  db.run("CREATE TABLE markers (lat FLOAT, lng FLOAT, name TEXT, image TEXT, radius FLOAT)");

  db.run("INSERT INTO dots VALUES('32.88121', '-117.237449', '75.11', '1528060310696', 'Fri Jun 01 2018', 'PROTECTED')");
  db.run("INSERT INTO dots VALUES('32.880097', '-117.236431', '10.34', '1528060310696', 'Sun Jun 03 2018', 'RESNET')");
  db.run("INSERT INTO dots VALUES('32.880984', '-117.237821', '36.12', '1528060310696', 'Sat Jun 02 2018', 'GUEST')");
  db.run("INSERT INTO dots VALUES('32.879323', '-117.237261', '4.5', '1528060310696', 'Sun Jun 03 2018', 'PROTECTED')");

  db.run("INSERT INTO markers VALUES('32.880236',  '-117.236392', 'Starbucks', 'images/starbucks.jpg', '.0004')");
  db.run("INSERT INTO markers VALUES('32.881130',  '-117.237556', 'Geisel Library', 'images/geisel.jpg', '.0007')");
  db.run("INSERT INTO markers VALUES('32.877879',  '-117.237243', 'Center Hall', 'images/center_hall.jpg', '.0006')");
  db.run("INSERT INTO markers VALUES('32.880153',  '-117.236093', 'Commuter Lounge', 'images/commuter_lounge.jpg', '.0006')");
  db.run("INSERT INTO markers VALUES('32.877782',  '-117.239793', 'Mandeville', 'images/mandeville.jpg', '0.0085')");
  db.run("INSERT INTO markers VALUES('32.874034',  '-117.242431', 'Revelle Reshalls', 'images/revelle_res.jpg', '0.00030103986447873877')");
  db.run("INSERT INTO markers VALUES('32.873794',  '-117.243065', 'Revelle Apartments', 'images/revelle_res.jpg', '0.00030504098085350304')");
  db.run("INSERT INTO markers VALUES('32.878336',  '-117.243140', 'Muir Apartments', 'images/muir_apart.jpg', '0.0003514612354251014')");
  db.run("INSERT INTO markers VALUES('32.879252',  '-117.243261', 'Muir Reshalls', 'images/muir_res.jpg', '0.0003514612354251014')");
  db.run("INSERT INTO markers VALUES('32.883253',  '-117.243314', 'Marshall Reshalls', 'images/marshall_res.jpg', '0.0003507506236626472')");
  db.run("INSERT INTO markers VALUES('32.883203',  '-117.241392', 'Marshall Apartments', 'images/marshall_apart.jpeg', '0.0006850029196918468')");
  db.run("INSERT INTO markers VALUES('32.885429',  '-117.243150', 'ERC Reshalls', 'images/erc_res.jpeg', '0.0006244909927305074')");
  db.run("INSERT INTO markers VALUES('32.885782',  '-117.241802', 'ERC Apartments', 'images/erc_apart.jpeg', '0.0006862863833759381')");
  db.run("INSERT INTO markers VALUES('32.888429',  '-117.242647', 'The Village', 'images/the_village.jpg', '0.0006090065681057408')");
  db.run("INSERT INTO markers VALUES('32.884281',  '-117.232328', 'Warren Reshalls', 'images/warren_res.jpg', '0.0007483167778485884')");
  db.run("INSERT INTO markers VALUES('32.882845',  '-117.232991', 'Warren Apartments', 'images/warren_apart.jpg', '0.0010653360971975504')");
  db.run("INSERT INTO markers VALUES('32.877939',  '-117.232912', 'Sixth Reshalls', 'images/sixth_res.jpeg', '0.0006188642823784831')");
  db.run("INSERT INTO markers VALUES('32.878556',  '-117.230422', 'Sixth Apartments', 'images/sixth_apart.jpeg', '0.0013859769117861005')");
  db.run("INSERT INTO markers VALUES('32.875514',  '-117.236976', 'Biomedical Library', 'images/biomed.jpg', '0.0006165070964654991')");
  db.run("INSERT INTO markers VALUES('32.879979',  '-117.240248', 'Peterson Hall', 'images/peterson.jpg', '0.00024201859432703454')");
  db.run("INSERT INTO markers VALUES('32.873839',  '-117.240953', 'Galbraith', 'images/galbraith.jpg', '0.00034201859432703454')");
  db.run("INSERT INTO markers VALUES('32.874562',  '-117.239970', 'York', 'images/york.jpg', '0.00084201859432703454')");
  db.run("INSERT INTO markers VALUES('32.880080',  '-117.237149', 'Sungod Lounge', 'images/sungodlounge.png', '0.00024201859432703454')");
  db.run("INSERT INTO markers VALUES('32.878285',  '-117.241684', 'HSS', 'images/hss.jpg', '0.0007')");
  db.run("INSERT INTO markers VALUES('32.878676',  '-117.242564', 'Middle of Muir', 'images/moms.jpg', '0.00006200806399156833')");
});

db.close();
