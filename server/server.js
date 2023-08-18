const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const mysql2 = require("mysql2/promise");
const bodyParser = require("body-parser");
const { execSync } = require("child_process");
const { Heap } = require("./heap.js");

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
  const is_repeat =
    req.body.month === "*" ||
    req.body.day === "*" ||
    req.body.hour === "*" ||
    req.body.minute === "*"
      ? 1
      : 0;
  if (req.body.month) {
    sql = `insert into job_info values ("${req.body.enrolled_time}","${req.body.name}",
      null
    ,"${req.body.month}","${req.body.day}","${req.body.hour}","${req.body.minute}", "${req.body.route}", 0, ${is_repeat});`;
  } else {
    sql = `insert into job_info values ("${req.body.enrolled_time}", "${req.body.name}", "${req.body.pre_condition}", null, null, null, null, "${req.body.route}", 0, ${is_repeat});`;
  }

  connection.query(sql, (err, result) => {
    if (err) throw err;
    else {
      let sql2 = `insert into flow values ("${req.body.enrolled_time}", `;
      if (req.body.pre_condition) {
        sql2 += `"${req.body.pre_condition}");`;
      } else {
        sql2 += "null);";
      }
      connection.query(sql2, (err, result) => {
        if (err) throw err;
      });

      let sql3 = ` insert ignore into expected_execution_time values ("${req.body.name}", 0,0);`;
      connection.query(sql3, (err, result) => {
        if (err) throw err;
      });

      res.json({ ...req.body });
    }
  });
});

app.delete("/job", (req, res) => {
  const sql = `delete from job_info where enrolled_time ="${req.query.id}";`;

  connection.query(sql, (err, result) => {
    if (err) throw err;
    else {
      const sql2 = `delete from flow where process = "${req.query.id}" || pre_condition = "${req.query.id}";`;
      connection.query(sql2, (err, result) => {
        if (err) throw err;
      });

      const sql3 = "select * from job_info;";
      connection.query(sql3, (err, result) => {
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
    sql = `update job_info set name="${name}",month="${month}",day="${day}",hour="${hour}",minute="${minute}",route="${route}" where enrolled_time = "${id}"`;
  } else {
    console.log("change condition!!");
    sql = `update job_info set name="${name}",route="${route}",pre_condition="${pre_condition}" where enrolled_time="${id}"`;
  }
  connection.query(sql, (err, result) => {
    if (err) throw err;
    else {
      const updateFlow = `update flow set pre_condition="${pre_condition}" where process = "${id}"`;
      connection.query(updateFlow);
      const sql2 = "select * from job_info";
      connection.query(sql2, (err, result) => {
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
  let sql2 = `update job_info set completed="${completed.toString()}" where enrolled_time="${
    job.enrolled_time
  }"`;
  connection.query(sql2);

  const time = new Date(completed - start).getTime() / 1000;

  let sql3 = `INSERT INTO expected_execution_time VALUES ("${job.name}", ${time},1)
  ON DUPLICATE KEY
  UPDATE execution_count = execution_count + 1, expected_time = ((expected_time * execution_count)+${time}) / (execution_count + 1);`;

  connection.query(sql3);
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
  const sql2 = `select * from job_info
  join flow 
  on job_info.enrolled_time = flow.process
  where flow.pre_condition = "${currJob.enrolled_time}"`;
  const [result] = await asyncConnection.query(sql2);
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
  const sql = `select * from job_info join expected_execution_time on job_info.name = expected_execution_time.name;`;
  let jobList = [];
  console.log("batch!!!", Date.now());
  connection.query(sql, (err, result) => {
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
