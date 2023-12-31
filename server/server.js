const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const mysql2 = require("mysql2/promise");
const bodyParser = require("body-parser");
const { execSync } = require("child_process");
const { Heap } = require("./heap.js");
const fs = require("fs");
const {
  blockedExecute,
  isTimePassed,
  isTimeMatched,
  updateHeap,
  mustBeExecuted,
  getTimeList,
  totalExecute,
  infiniteCheck,
} = require("./func.js");

const {
  refTotalJobInfo,
  insertTimeJob,
  insertConditionJob,
  insertConditionFlow,
  insertTimeFlow,
  insertExecutionTime,
  deleteJobInfo,
  deleteFlow,
  updateTimeJob,
  updateConditionJob,
  updateCompleted,
  calExecutionTime,
  refJobInfoJoinWithFlow,
  refJobInfoJoinWithExecutionTime,
  updateFlow,
  deleteExecutionTime,
  refFlow,
} = require("./query.js");

const port = 5050;

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "sh12091209",
  database: "scheduler",
  dateStrings: "date",
  connectionLimit: 10,
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/job", (req, res) => {
  connection.query(refTotalJobInfo, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/job", (req, res) => {
  let sql = "";
  const is_repeat =
    req.body.month === "*" ||
    req.body.day === "*" ||
    req.body.hour === "*" ||
    req.body.minute === "*"
      ? 1
      : 0;
  if (req.body.month) {
    sql = insertTimeJob(req.body, is_repeat);
  } else {
    sql = insertConditionJob(req.body, is_repeat);
  }

  connection.query(sql, (err, result) => {
    if (err) throw err;
    else {
      let sql2 = "";
      if (req.body.pre_condition) {
        sql2 = insertConditionFlow(req.body);
      } else {
        sql2 = insertTimeFlow(req.body);
      }

      connection.query(sql2, (err, result) => {
        if (err) throw err;
      });

      connection.query(insertExecutionTime(req.body), (err, result) => {
        if (err) throw err;
      });

      res.json({ ...req.body });
    }
  });
});

app.delete("/job", (req, res) => {
  connection.query(deleteJobInfo(req.query), (err, result) => {
    if (err) throw err;
    else {
      connection.query(deleteFlow(req.query), (err, result) => {
        if (err) throw err;
      });
      connection.query(deleteExecutionTime(req.query));

      connection.query(refTotalJobInfo, (err, result) => {
        res.json(result);
      });
    }
  });
});

app.put("/job", (req, res) => {
  const { id } = req.query;
  const { month, name } = req.body;
  let sql = "";
  if (month) {
    sql = updateTimeJob(req.body, id);
  } else {
    sql = updateConditionJob(req.body, id);
  }
  connection.query(sql, (err, result) => {
    if (err) throw err;
    else {
      connection.query(updateFlow(req.body, name));
      connection.query(refTotalJobInfo, (err, result) => {
        if (err) throw err;
        else {
          res.json(result);
        }
      });
    }
  });
});

app.get("/flow", (req, res) => {
  const { name } = req.query;
  connection.query(refFlow(name), (err, result) => {
    if (err) throw err;
    else {
      const pre = [];
      const post = [];
      for (let graph of result) {
        if (graph.pre_condition) {
          if (graph.process === name && graph.pre_condition)
            pre.push(graph.pre_condition);
          if (graph.pre_condition === name) post.push(graph.process);
        }
      }
      res.json({
        pre: pre,
        curr: [name],
        post: post,
      });
    }
  });
});

app.get("/log", (req, res) => {
  fs.readFile("../log/log.txt", "utf-8", (err, data) => {
    const logArray = data.toString().split("\n");
    res.json(logArray.slice(logArray.length - 20, logArray.length));
  });
});

app.listen(port, () => {
  console.log(`express is running on ${port}`);
});

infiniteCheck();
