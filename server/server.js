const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
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
        console.log(result);
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
    sql = `update job_info set name="${name}",route="${route}",pre_condition="${pre_condition}" where enrolled_time="${id}"`;
  }
  connection.query(sql, (err, result) => {
    if (err) throw err;
    else {
      const sql2 = "select * from job_info";
      connection.query(sql2, (err, result) => {
        if (err) throw err;
        else {
          console.log(result);
          res.json(result);
        }
      });
    }
  });
});

const execute = (job) => {
  console.log(
    execSync(`cd ../scripts && sh ${job.route}`).toString(),
    Date.now()
  );
};

const checkExec = (now, enrolled) => {
  for (let index = 0; index < 4; index++) {
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

const getTimeList = (date) => {
  return [
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];
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
        // console.log(job);
        if (job.month) {
          if (
            checkExec(getTimeList(now_to_date_format), [
              parseInt(job.month),
              parseInt(job.day),
              parseInt(job.hour),
              parseInt(job.minute),
            ])
          ) {
            heap.heappush(job);
            // execute(job);
          } else console.log("not yet!");
        } else {
          console.log("condition!!");
        }
      }

      while (heap.getLength() > 0) {
        console.log("start : ", Date.now());
        const currJob = heap.heappop();
        execute(currJob);
        // console.log(heap);
        // console.log(currJob);
      }
    }
  });
  res.json({ success: 1 });
});

app.listen(port, () => {
  console.log(`express is running on ${port}`);
});
