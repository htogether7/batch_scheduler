const fs = require("fs");
const mysql = require("mysql");
const mysql2 = require("mysql2/promise");
const { exec } = require("child_process");
const {
  updateCompleted,
  calExecutionTime,
  refJobInfoJoinWithFlow,
  checkPreCondition,
  refJobInfoJoinWithExecutionTime,
} = require("./query");

const { Heap } = require("./heap.js");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "sh12091209",
  database: "scheduler",
  dateStrings: "date",
  connectionLimit: 10,
});

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

const updateHeap = async (heap, currJob) => {
  const asyncConnection = await mysql2.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "sh12091209",
    database: "scheduler",
    dateStrings: "date",
    connectionLimit: 10,
  });
  const [result] = await asyncConnection.query(refJobInfoJoinWithFlow(currJob));
  asyncConnection.end();
  return result;
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
    if (job.hour === "*") minimum_term = 1000 * 60 * 60;
    if (job.minute === "*") minimum_term = 1000 * 60;

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

const heapPush = (jobList, heap) => {
  const now_to_date_format = new Date(Date.now());
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
};

const judgeJobs = (jobList) => {
  connection.query(refJobInfoJoinWithExecutionTime, (err, result) => {
    if (err) throw err;
    else {
      const heap = new Heap();
      jobList = result;
      heapPush(jobList, heap);

      if (heap.getLength() === 0) console.log("nothing to be executed!");
      else totalExecute(heap);
    }
  });
};

const execute = (job, blocked, resolve) => {
  const start = Date.now();

  exec(`cd ../scripts && sh ${job.route}`, (err, stdout, stderr) => {
    console.log(stdout, new Date(Date.now()), job.name);

    const content = `${job.name} 완료 - ${new Date(Date.now())} \n`;
    fs.appendFile("../log/log.txt", content, (err) => {
      if (err) console.log(err);
    });

    const completed = Date.now();

    connection.query(updateCompleted(completed, job));
    if (blocked) {
      const time = new Date(completed - start).getTime() / 1000;
      connection.query(calExecutionTime(job, time));
      resolve();
    }
  });
};

const blockedExecute = (job) => {
  return new Promise((resolve, reject) => execute(job, true, resolve));
};

const isPreCondition = async (job) => {
  const asyncConnection = await mysql2.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "sh12091209",
    database: "scheduler",
    dateStrings: "date",
  });

  const [result] = await asyncConnection.query(checkPreCondition(job.name));
  asyncConnection.end();

  return result.length > 0 ? true : false;
};

const totalExecute = async (heap) => {
  while (heap.getLength() > 0) {
    const currJob = heap.heappop();
    const checkPreCondition = await isPreCondition(currJob);
    if (checkPreCondition) {
      await blockedExecute(currJob);
    } else {
      execute(currJob, false);
    }
    await updateHeap(heap, currJob).then((res) => {
      for (let job of res) {
        heap.heappush(job);
      }
    });
  }
};

const infiniteCheck = async () => {
  while (true) {
    await new Promise((r) => setTimeout(r, 20000)).then(() => {
      let jobList = [];
      console.log("batch!!!", Date.now());
      judgeJobs(jobList);
    });
  }
};

module.exports = {
  blockedExecute,
  isTimePassed,
  isTimeMatched,
  updateHeap,
  mustBeExecuted,
  getTimeList,
  totalExecute,
  infiniteCheck,
};
