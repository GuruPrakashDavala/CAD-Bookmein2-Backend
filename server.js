const express = require("express");
const app = express();
const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "guruprakash5",
  database: "bookmein",
});

// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query("SELECT * FROM attendees", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   });
// });

app.get("/", (req, res) => {
  //res.json("hello");
  //var today = new Date();
  //   res.send("your api is working fine today " + today);
  con.query("SELECT * FROM attendees", function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    res.send(result);
  });
});

const port = 3000;
app.listen(port);
