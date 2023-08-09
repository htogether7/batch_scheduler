const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

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
  let sql = "";
  if (req.body.month) {
    sql = `insert into job_info values ("${req.body.enrolled_time}","${req.body.name}",
      null
    ,"${req.body.month}","${req.body.day}","${req.body.hour}","${req.body.minute}", "${req.body.route}");`;
  } else {
    sql = `insert into job_info values ("${req.body.enrolled_time}", "${req.body.name}", "${req.body.pre_condition}", null, null, null, null, "${req.body.route}");`;
  }

  connection.query(sql, (err, result) => {
    if (err) throw err;
    else {
      const sql2 = `insert into flow values ("${req.body.enrolled_time}", "${req.body.pre_condition}")`;
      connection.query(sql2, (err, result) => {
        if (err) throw err;
      });
      res.json({ ...req.body });
    }
  });
});

app.post("/batch", (req, res) => {
  // console.log(req.body.time);
  const sql = `select * from job_info;`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    else {
      // res.json(result);
      console.log(result);
    }
  });

  const proc = exec("cd ../scripts && sh a.sh ");
  proc.stdout.on("data", function (data) {
    console.log(data.toString().trim());
  });
  proc.stderr.on("data", function (data) {
    console.error(data.toString().trim());
  });
  res.json({ success: 1 });
});

app.listen(port, () => {
  console.log(`express is running on ${port}`);
});
