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

//User Body-Parser to access request body
app.use(bodyParser.json());

//CORS Configuration
app.use(cors());

//Default route - localhost 3000
app.get("/", (req, res) => {
  res.send("Your API is working fine today");
});

//API for popular sessions based on registrations
app.get("/eventregistrations", (req, res) => {
  con.query(
    "SELECT registrations.event_id, COUNT(registrations.event_id) as total_registrations, events.name FROM bookmein.registrations INNER JOIN bookmein.events ON registrations.event_id = events.id WHERE event_id IN (SELECT id FROM bookmein.events WHERE event_type = '86') GROUP BY event_id ORDER BY total_registrations DESC;",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

//API for popular sessions based on total time spent
app.get("/geteventsbytotaltimespent", (req, res) => {
  con.query(
    "SELECT attendee_session_tracking.eventid, COUNT(attendee_session_tracking.eventid) as totaltime, events.name FROM bookmein.attendee_session_tracking  INNER JOIN bookmein.events ON attendee_session_tracking.eventid = events.id GROUP BY eventid  ORDER BY totaltime DESC;",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

//API to get all attendee-attendee conversations - based on the route param
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

//API to get all conversation between attendee and exhibior - based on the route param
//Get All messages by attendeeID
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

//API to get single attendee details based on the route param
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

//API to fetch all events attended by attendee - based on the route param
app.get("/getalleventsattendedbyattendee/:attendeeID", (req, res) => {
  con.query(
    "SELECT attendeeid,eventid, COUNT(attendeeid)/6 as totaltimespent from bookmein.attendee_session_tracking WHERE attendeeid = " +
      req.params.attendeeID +
      " GROUP BY eventid ORDER BY totaltimespent DESC; ",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

//API to get total attendees registered
app.get("/totalregistered", (req, res) => {
  con.query(
    "SELECT count(attendee_id) as totalregistrations FROM bookmein.registrations;",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

//API to get total attendees attended
app.get("/totalattended", (req, res) => {
  con.query(
    "SELECT count(distinct attendeeid) as totalattended from bookmein.attendee_session_tracking;",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

//API to get Total Attended grouped by event_id
app.get("/attendeesgroupedbyeventid", (req, res) => {
  con.query(
    "SELECT count(distinctAttendees.attendeeid) AS totalAttended, distinctAttendees.eventid, events.name FROM (SELECT DISTINCT attendeeid, eventid FROM bookmein.attendee_session_tracking) distinctAttendees INNER JOIN bookmein.events ON distinctAttendees.eventid = events.id GROUP BY distinctAttendees.eventid ORDER BY totalAttended DESC;",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

//API to get total stands visited and duration spent
app.get("/standsvisitedandduration", (req, res) => {
  con.query(
    "SELECT eventid, COUNT(eventid) AS totaltime, events.name FROM bookmein.stand_attendance INNER JOIN bookmein.events ON stand_attendance.eventid = events.id WHERE eventid IN (SELECT id from bookmein.events where event_type = 87) GROUP BY eventid;",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

//port number and listening on localhost 3000
const port = 3000;
app.listen(port);
