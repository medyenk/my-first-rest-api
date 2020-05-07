// Create express app

var express = require("express");
var app = express();
var db = require("./database.js");

//When you send POST data, normally this information is URL encoded from a form. You need to add some extra pre-processing to parse the body of POST requests.
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port

const HTTP_PORT = 3000;

//Start server

app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

// Root endpoint
app.get("/", (req, res, next) => {
  res.json({ message: "OK" });
});

// Insert here other API endpoints

// -------------------- OWNERS -----------------------------------//
// ---------------------------------------------------------------//

// GET all owners ------------------------------------------------------

app.get("/owners", (req, res, next) => {
  var sql = "select * from owners";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows
    });
  });
});

// GET one owner by ID ----------------------------------------------

app.get("/owners/:id", (req, res, next) => {
  var sql = "select * from owners where id = ?";
  var params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    return row
      ? res.json({
          message: "success",
          data: row
        })
      : res.json({
          message: "No owner found"
        });
  });
});

// GET owners by AGE ----------------------------------------------

app.get("/owners/age/:age", (req, res, next) => {
  var sql = "select * from owners where age = ?";
  var params = [req.params.age];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    return row
      ? res.json({
          message: "success",
          data: row
        })
      : res.json({
          message: "No owner found"
        });
  });
});

// POST owner ----------------------------------------------------

app.post("/owners/", (req, res, next) => {
  var errors = [];
  if (req.body.first_name === null) {
    errors.push("No first name given");
  }
  if (req.body.last_name === null) {
    errors.push("No last name given");
  }
  if (req.body.household_members === null) {
    errors.push("Please tell us how many members in the household");
  }
  if (req.body.age === null) {
    errors.push("Please give the age of the owner");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(", ") });
  }

  var data = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    age: req.body.age,
    household_members: req.body.household_members
  };
  var sql =
    "INSERT INTO owners (first_name, last_name, age, household_members) VALUES (?,?,?,?)";
  var params = [
    data.first_name,
    data.last_name,
    data.age,
    data.household_members
  ];
  //the use of a classic function(err, result) { } notation instead of ES6 arrow function for the callback. This way is to make available the this
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
      id: this.lastID
      // This ID is useful if you need to retrieve the user after creating.
    });
  });
});

// PATCH an owner --------------------------------------------------

app.patch("/owners/:id", (req, res, next) => {
  var data = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    age: req.body.age,
    household_members: req.body.household_members
  };

  var sql = `UPDATE owners SET
  first_name = COALESCE(?, first_name),
  last_name = COALESCE(?, last_name),
  age = COALESCE(?, age),
  household_members = COALESCE(?, household_members)
  WHERE id = ?`;

  var params = [
    data.first_name,
    data.last_name,
    data.age,
    data.household_members,
    req.params.id
  ];

  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
      changes: this.changes
    });
  });
});

// DELETE an owner -----------------------------------------------

app.delete("/owners/:id", (req, res, next) => {
  var sql = "DELETE FROM owners WHERE id = ?";
  var params = req.params.id;
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }
    res.json({
      message: "deleted",
      changes: this.changes
    });
  });
});

// -------------------- HOUSES -----------------------------------//
// ---------------------------------------------------------------//

// GET all houses ------------------------------------------------

app.get("/houses", (req, res, next) => {
  var sql = "select * from houses";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows
    });
  });
});

// GET one house by ID -------------------------------------------

app.get("/houses/:id", (req, res, next) => {
  var sql = "SELECT * FROM houses WHERE id = ?";
  var params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    return row
      ? res.json({
          message: "success",
          data: row
        })
      : res.json({
          message: "No house found"
        });
  });
});

// POST house -------------------------------------------------

app.post("/houses/", (req, res, next) => {
  var errors = [];
  if (!req.body.street_address) {
    errors.push("No street address given");
  }
  if (!req.body.postcode) {
    errors.push("No postcode given");
  }
  if (!req.body.owner_id) {
    errors.push("Who owns the house");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(", ") });
  }

  var data = {
    street_address: req.body.street_address,
    postcode: req.body.postcode,
    owner_id: req.body.owner_id
  };
  var sql =
    "INSERT INTO houses (street_address, postcode, owner_id) VALUES (?,?,?)";
  var params = [data.street_address, data.postcode, data.owner_id];
  //the use of a classic function(err, result) { } notation instead of ES6 arrow function for the callback. This way is to make available the this
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
      id: this.lastID
      // This ID is useful if you need to retrieve the user after creating.
    });
  });
});

// PATCH house ------------------------------------

app.patch("/houses/:id", (req, res, next) => {
  var data = {
    street_address: req.body.street_address,
    postcode: req.body.postcode,
    owner_id: req.body.owner_id
  };

  var sql = `UPDATE houses SET
  street_address = COALESCE(?, street_address),
  postcode = COALESCE(?, postcode),
  owner_id = COALESCE(?, owner_id)
  WHERE id = ?`;

  var params = [
    data.street_address,
    data.postcode,
    data.owner_id,
    req.params.id
  ];

  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
      changes: this.changes
    });
  });
});

// DELETE a house

app.delete("/houses/:id", (req, res, next) => {
  var sql = "DELETE FROM houses WHERE id = ?";
  var params = req.params.id;
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }
    res.json({
      message: "deleted",
      changes: this.changes
    });
  });
});

// Default response for any other request
app.use(function(req, res) {
  res.status(404);
});
