const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const mysql2 = require("mysql2/promise");
const bodyParser = require("body-parser");
const { execSync } = require("child_process");
const { Heap } = require("./heap.js");
const {
  blockedExecute,
  isTimePassed,
  isTimeMatched,
  updateHeap,
  mustBeExecuted,
  getTimeList,
  totalExecute,
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
  const { month } = req.body;
  let sql = "";
  if (month) {
    sql = updateTimeJob(req.body, id);
  } else {
    sql = updateConditionJob(req.body, id);
  }
  connection.query(sql, (err, result) => {
    if (err) throw err;
    else {
      connection.query(updateFlow(req.body, id));
      connection.query(refTotalJobInfo, (err, result) => {
        if (err) throw err;
        else {
          res.json(result);
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`express is running on ${port}`);
});

const infiniteCheck = async () => {
  while (true) {
    await new Promise((r) => setTimeout(r, 20000)).then(() => {
      let jobList = [];
      console.log("batch!!!", Date.now());
      connection.query(refJobInfoJoinWithExecutionTime, (err, result) => {
        if (err) throw err;
        else {
          const now_to_date_format = new Date(Date.now());
          const heap = new Heap();
          jobList = result;
          for (let job of jobList) {
            if (job.month) {
              if (!job.is_repeat) {
                if (
                  isTimePassed(getTimeList(now_to_date_format), [
                    job.month,
                    job.day,
                    job.hour,
                    job.minute,
                  ]) &&
                  mustBeExecuted(job)
                ) {
                  heap.heappush(job);
                }
              } else {
                if (
                  isTimeMatched(getTimeList(now_to_date_format), [
                    job.month,
                    job.day,
                    job.hour,
                    job.minute,
                  ]) &&
                  mustBeExecuted(job)
                ) {
                  heap.heappush(job);
                }
              }
            }
          }

          if (heap.getLength() === 0) console.log("nothing to be executed!");
          else totalExecute(heap);
        }
      });
    });
  }
};

infiniteCheck();
