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
  // console.log(id, name, month, day, hour, minute, route, pre_condition);
  let sql = "";
  if (month) {
    sql = `update job_info set name="${name}",month="${month}",day="${day}",hour="${hour}",minute="${minute}",route="${route}" where enrolled_time = "${id}"`;
  } else {
    sql = `update job_info set name="${name}",route="${route}",pre_condition="${pre_condition}" where enrolled_time="${id}"`;
  }
  connection.query(sql, (err, result) => {
    if (err) throw err;
    else {
      // // console.log(result);
      // res.json(result);
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

const execute = async (job) => {
  const start = Date.now();
  const { stdout, stderr } = await exec(`cd ../scripts && sh ${job.route}`);
  // proc.stdout.on("data", function (data) {
  // console.log(data.toString().trim(), Date.now());
  // });
  // proc.stderr.on("data", function (data) {
  // console.error(data.toString().trim());
  // });
  if (!job.is_repeat && completed) return 0;
  stdout.on("data", (data) => {
    console.log(data.toString().trim(), Date.now());
    const end = Date.now();
    const execution_time = new Date(end - start).getTime().toString();
    // console.log(execution_time);
    // console.log(job);
    const sql = `update job_info set completed="${end.toString()}" where enrolled_time = "${
      job.enrolled_time
    }"`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      // else {
      // }
    });
  });

  // console.log("out", stdout);
  // console.log("err", stderr);
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
  const sql = `select * from job_info;`;
  let jobList = [];
  connection.query(sql, (err, result) => {
    if (err) throw err;
    else {
      const now_to_date_format = new Date(parseInt(req.body.time));

      jobList = result;
      for (let job of jobList) {
        if (job.month) {
          if (
            checkExec(getTimeList(now_to_date_format), [
              parseInt(job.month),
              parseInt(job.day),
              parseInt(job.hour),
              parseInt(job.minute),
            ])
          ) {
            execute(job);
          } else console.log("not yet!");
        } else {
          console.log("condition!!");
        }
      }
    }
  });
  // console.log("exec!", .getMonth());
  res.json({ success: 1 });
});

app.listen(port, () => {
  console.log(`express is running on ${port}`);
});
