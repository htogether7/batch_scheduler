const refTotalJobInfo = `select * from job_info;`;

const insertTimeJob = (body, is_repeat) => {
  return `insert into job_info values ("${body.enrolled_time}","${body.name}",
      null
    ,"${body.month}","${body.day}","${body.hour}","${body.minute}", "${body.route}", 0, ${is_repeat});`;
};

const insertConditionJob = (body, is_repeat) => {
  return `insert into job_info values ("${body.enrolled_time}", "${body.name}", "${body.pre_condition}", null, null, null, null, "${body.route}", 0, ${is_repeat});`;
};

const insertConditionFlow = (body) => {
  return `insert into flow values ("${body.enrolled_time}","${body.pre_condition}");`;
};

const insertTimeFlow = (body) => {
  return `insert into flow values ("${body.enrolled_time}", null);`;
};

const insertExecutionTime = (body) => {
  return ` insert ignore into expected_execution_time values ("${body.name}", 0,0);`;
};

const deleteJobInfo = (query) => {
  return `delete from job_info where enrolled_time ="${query.id}";`;
};

const deleteFlow = (query) => {
  return `delete from flow where process = "${query.id}" || pre_condition = "${query.id}";`;
};

const updateTimeJob = (timeInfo, id) => {
  return `update job_info set name="${timeInfo.name}",month="${timeInfo.month}",day="${timeInfo.day}",hour="${timeInfo.hour}",minute="${timeInfo.minute}",route="${timeInfo.route}" where enrolled_time = "${id}"`;
};

const updateConditionJob = (timeInfo, id) => {
  return `update job_info set name="${timeInfo.name}",route="${timeInfo.route}",pre_condition="${timeInfo.pre_condition}" where enrolled_time="${id}"`;
};

const updateFlow = (timeInfo, id) => {
  return `update flow set pre_condition="${timeInfo.pre_condition}" where process = "${id}"`;
};

const updateCompleted = (completed, job) => {
  return `update job_info set completed="${completed.toString()}" where enrolled_time="${
    job.enrolled_time
  }"`;
};

const calExecutionTime = (job, time) => {
  return `INSERT INTO expected_execution_time VALUES ("${job.name}", ${time},1)
  ON DUPLICATE KEY
  UPDATE execution_count = execution_count + 1, expected_time = ((expected_time * execution_count)+${time}) / (execution_count + 1);`;
};

const refJobInfoJoinWithFlow = (job) => {
  return `select * from job_info
    join flow 
    on job_info.enrolled_time = flow.process
    where flow.pre_condition = "${job.enrolled_time}"`;
};

const refJobInfoJoinWithExecutionTime = `select * from job_info join expected_execution_time on job_info.name = expected_execution_time.name;`;

module.exports = {
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
  updateFlow,
  updateCompleted,
  calExecutionTime,
  refJobInfoJoinWithFlow,
  refJobInfoJoinWithExecutionTime,
};
