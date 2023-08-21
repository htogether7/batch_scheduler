const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const mysql2 = require("mysql2/promise");
const bodyParser = require("body-parser");
const { execSync } = require("child_process");
const { Heap } = require("./heap.js");

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
} = require("./query.js");

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

// connection.connect((err) => {
//   if (err) {
//     console.log("mysql connection error");
//     throw err;
//   } else {
//     console.log("connect!");
//   }
// });

app.get("/job", (req, res) => {
  // const sql = `select * from job_info;`;
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

      connection.query(refTotalJobInfo, (err, result) => {
        res.json(result);
      });
    }
  });
});

app.put("/job", (req, res) => {
  const { id } = req.query;
  const { month, day, hour, minute, pre_condition, route, name } = req.body;
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

const execute = (job) => {
  const start = Date.now();
  console.log(execSync(`cd ../scripts && sh ${job.route}`).toString());

  const completed = Date.now();
  connection.query(updateCompleted(completed, job));

  const time = new Date(completed - start).getTime() / 1000;
  connection.query(calExecutionTime(job, time));
};

const isTimePassed = (now, enrolled) => {
  for (let index = 0; index < 4; index++) {
    if (enrolled[index] === "*") continue;
    if (now[index] < enrolled[index]) {
      return false;
    } else if (now[index] > enrolled[index]) {
      return true;
    } else {
      if (index === 3) return true;
    }
  }
  return true;
};

const isTimeMatched = (now, enrolled) => {
  for (let index = 0; index < 4; index++) {
    if (enrolled[index] === "*") continue;
    if (now[index] !== enrolled[index]) return false;
  }
  return true;
};

const mustBeExecuted = (job) => {
  if (job.completed === "0") return true;
  if (!job.is_repeat) {
    if (!job.completed === "0") {
      return false;
    }
  } else if (job.is_repeat) {
    const now = Date.now();
    const completed = parseInt(job.completed);

    let minimum_term = 0;
    if ((job.hour = "*")) minimum_term = 1000 * 60 * 60;
    if ((job.minute = "*")) minimum_term = 1000 * 60;

    if (now - completed >= minimum_term) {
      return true;
    } else return false;
  }
};

const getTimeList = (date) => {
  return [
    (date.getMonth() + 1).toString(),
    date.getDate().toString(),
    date.getHours().toString(),
    date.getMinutes().toString(),
  ];
};

const updateHeap = async (heap, currJob) => {
  const asyncConnection = await mysql2.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "sh12091209",
    database: "scheduler",
    dateStrings: "date",
  });
  const [result] = await asyncConnection.query(refJobInfoJoinWithFlow(currJob));
  return result;
};

const totalExecute = async (heap) => {
  while (heap.getLength() > 0) {
    const currJob = heap.heappop();
    execute(currJob);
    await updateHeap(heap, currJob).then((res) => {
      for (let job of res) {
        heap.heappush(job);
      }
    });

    console.log(currJob.name, "end!!", Date.now());
  }
};

app.post("/batch", (req, res) => {
  let jobList = [];
  console.log("batch!!!", Date.now());
  connection.query(refJobInfoJoinWithExecutionTime, (err, result) => {
    if (err) throw err;
    else {
      const now_to_date_format = new Date(parseInt(req.body.time));
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
      totalExecute(heap);
    }
  });
  res.json({ success: 1 });
});

app.listen(port, () => {
  console.log(`express is running on ${port}`);
});
