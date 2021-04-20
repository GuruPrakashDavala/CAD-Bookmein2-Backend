const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

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

//User Body-Parser to access request body
//parse application/json
app.use(bodyParser.json());

//CORS Configuration
app.use(cors());

app.get("/", (req, res) => {
  // con.query("SELECT * FROM attendees", function (err, result, fields) {
  //   if (err) throw err;
  //   res.send(result);
  // });
  res.send("Your API is working fine");
});

app.get("/eventregistrations", (req, res) => {
  con.query(
    "SELECT event_id, COUNT(*) as total_registrations FROM bookmein.registrations WHERE event_id IN (SELECT id FROM bookmein.events WHERE event_type = '86') GROUP BY event_id ORDER BY total_registrations DESC;",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.get("/getallattendeesmessages", (req, res) => {
  console.log("entered route");
  con.query("SELECT * from attendees;", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

//Get All messages by attendeeID
app.get("/getallattendeesmessages/:attendeeID", (req, res) => {
  //console.log("entered route");
  con.query(
    "SELECT meeting_response.meetingid, meeting_response.message_from, meeting_response.message_to, meeting_response.meeting_date, meeting_response.date_sent, meeting_response.message, attendees.first_name, attendees.last_name FROM bookmein.meeting_response INNER JOIN bookmein.attendees ON meeting_response.message_from = attendees.id WHERE meeting_response.message_from = " +
      req.params.attendeeID +
      ";",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});



const port = 3000;
app.listen(port);
