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
  return `insert into flow values ("${body.name}","${body.pre_condition}");`;
};

const insertTimeFlow = (body) => {
  return `insert into flow values ("${body.name}", null);`;
};

const insertExecutionTime = (body) => {
  return ` insert ignore into expected_execution_time values ("${body.enrolled_time}", 0,0);`;
};

const deleteJobInfo = (query) => {
  return `delete from job_info where name ="${query.name}";`;
};

const deleteFlow = (query) => {
  return `delete from flow where process = "${query.name}" || pre_condition = "${query.name}";`;
};

const deleteExecutionTime = (query) => {
  return `delete from expected_execution_time where id = "${query.id}"`;
};

const updateTimeJob = (timeInfo, id) => {
  return `update job_info set name="${timeInfo.name}",month="${timeInfo.month}",day="${timeInfo.day}",hour="${timeInfo.hour}",minute="${timeInfo.minute}",route="${timeInfo.route}" where enrolled_time = "${id}"`;
};

const updateConditionJob = (timeInfo, id) => {
  return `update job_info set name="${timeInfo.name}",route="${timeInfo.route}",pre_condition="${timeInfo.pre_condition}" where enrolled_time="${id}"`;
};

const updateFlow = (timeInfo, name) => {
  return `update flow set pre_condition="${timeInfo.pre_condition}" where process = "${name}"`;
};

const updateCompleted = (completed, job) => {
  return `update job_info set completed="${completed.toString()}" where enrolled_time="${
    job.enrolled_time
  }"`;
};

const calExecutionTime = (job, time) => {
  return `INSERT INTO expected_execution_time VALUES ("${job.enrolled_time}", ${time},1)
  ON DUPLICATE KEY
  UPDATE execution_count = execution_count + 1, expected_time = ((expected_time * execution_count)+${time}) / (execution_count + 1);`;
};

const refJobInfoJoinWithFlow = (job) => {
  return `select * from job_info
    join flow 
    on job_info.name = flow.process
    where flow.pre_condition = "${job.name}"`;
};

const refJobInfoJoinWithExecutionTime = `select * from job_info join expected_execution_time on job_info.enrolled_time = expected_execution_time.id;`;

const checkPreCondition = (name) => {
  return `select * from flow where pre_condition = "${name}"`;
};

const refFlow = (name) => {
  return `select * from flow where (process="${name}" || pre_condition="${name}")`;
};

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
  checkPreCondition,
  deleteExecutionTime,
  refFlow,
};
