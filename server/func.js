const mysql2 = require("mysql2/promise");

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

module.exports = {
  execute,
  isTimePassed,
  isTimeMatched,
  updateHeap,
  mustBeExecuted,
  getTimeList,
  totalExecute,
};