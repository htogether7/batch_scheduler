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

// app.get("/api/login", (req, res) => {
//   const submitted_id = req.query.id;
//   const submitted_pw = req.query.pw;
//   const sql = `SELECT * FROM user WHERE user.id = "${submitted_id}" and user.pw = "${submitted_pw}"`;
//   db.query(sql, (err, result, fields) => {
//     if (err) throw err;
//     else {
//       if (result.length == 0) {
//         console.log("다시 확인 해주세요");
//         res.json({ login: 0 });
//       } else {
//         console.log("로그인 성공");
//         res.cookie("user", submitted_id, {
//           expires: new Date(Date.now() + 900000),
//         });
//         res.json({ login: 1 });
//       }
//     }
//   });
// });

app.post("/job", (req, res) => {
  console.log(req.body);
  const sql = `insert into job_info values ("${new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ")}","${req.body.name}","${req.body.condition}","${
    req.body.month
  }","${req.body.day}","${req.body.hour}","${req.body.minute}");`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(req.body);
    }
  });
});

app.listen(port, () => {
  console.log(`express is running on ${port}`);
});
