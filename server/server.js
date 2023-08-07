const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const port = 5050;

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "sh12091209",
  database: "scheduler",
  dateStrings: "date",
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

connection.connect((err) => {
  if (err) {
    console.log("mysql connection error");
    throw err;
  } else {
    console.log("connect!");
  }
});

app.get("/job", (req, res) => {
  const sql = `select * from job_info;`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/job", (req, res) => {
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const sql = `insert into job_info values ("${now}","${req.body.name}","${req.body.condition}","${req.body.month}","${req.body.day}","${req.body.hour}","${req.body.minute}");`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json({ ...req.body });
    }
  });
});

app.listen(port, () => {
  console.log(`express is running on ${port}`);
});
