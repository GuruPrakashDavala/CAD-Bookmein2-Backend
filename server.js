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

//Get all conversation between delegates and exhibior
app.get("/getallexhibitorsanddelegatesconversation/:attendeeID", (req, res) => {
  con.query(
    "SELECT * FROM bookmein.exhibitor_conversation INNER JOIN bookmein.exhibitor_message ON exhibitor_conversation.id = exhibitor_message.conversationid WHERE delegateid = " +
      req.params.attendeeID +
      ";",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

//Get attendee details
app.get("/getattendeedetails/:attendeeID", (req, res) => {
  con.query(
    "SELECT id, first_name, last_name FROM bookmein.attendees where id = " +
      req.params.attendeeID +
      ";",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.get("/geteventsattended", (req, res) => {
  con.query(
    "SELECT COUNT(" +
      req.params.attendeeID +
      ") FROM bookmein.attendee_session_tracking WHERE attendeeid =" +
      req.params.attendeeID +
      " GROUP BY eventid; ",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

//popular sessions by total time spent
app.get("/geteventsbytotaltimespent", (req, res) => {
  con.query(
    "SELECT eventid, COUNT(eventid) as totaltime FROM bookmein.attendee_session_tracking GROUP BY eventid ORDER BY totaltime DESC;",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
      // console.log(result.length);
    }
  );
});

app.get("/totalevent", (req, res) => {
  con.query(
    "SELECT eventid from bookmein.attendee_session_tracking where eventid=3457;",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
      console.log(result.length);
    }
  );
});

const port = 3000;
app.listen(port);
