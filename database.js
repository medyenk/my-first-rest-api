var sqlite3 = require("sqlite3").verbose();

//The .verbose() modifier is to get extra information for debugging. MD5 is used to create a hash for stored passwords, avoiding to save plain text passwords.

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, err => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw error;
  } else {
    console.log("Connected to the SQLite database.");
  }
});

db.run(
  `CREATE TABLE owners(
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   first_name text, 
   last_name text, 
   age integer, 
   household_members integer
)`,
  err => {
    if (err) {
      // Table already created
    } else {
      // Table just created, creating some rows
      var insert =
        "INSERT INTO owners (first_name, last_name, age, household_members) VALUES (?,?,?,?)";
      db.run(insert, ["Ines", "Guerrero", 32, "2"]);
      db.run(insert, ["Dominic", "McDonnell", 35, "3"]);
      db.run(insert, ["Luke", "Armstrong", 26, "3"]);
    }
  }
);

db.run(
  `CREATE TABLE houses(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    street_address text not null, 
    postcode text not null,
    owner_id integer,
    FOREIGN KEY (owner_id)
    REFERENCES owners (owner_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    )`,
  err => {
    if (err) {
      //Table already created
      //   console.error(err.message);
    } else {
      // Table only created, creating some rows
      var insert =
        "INSERT INTO houses (street_address, postcode, owner_id) VALUES (?,?,?)";
      db.run(insert, ["56 Whittington Road", "N22 8YF", 1]);
      db.run(insert, ["32 Oliphant Street", "W10 4EG", 2]);
      db.run(insert, ["100 East Road", "N22 8YF", 3]);
    }
  }
);

module.exports = db;
