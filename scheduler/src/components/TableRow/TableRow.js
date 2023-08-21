import React from "react";
import "./TableRow.css";

const TableRow = ({
  handleDeleteClick,
  handleUpdateClick,
  job,
  jobs,
  setSelectedCondition,
  mode,
}) => {
  const alwaysFilter = (info) => {
    return info === "*" ? "매" : info;
  };

  const handleTrClick = (e) => {
    if (mode === "condition") {
      setSelectedCondition(e.target.parentElement.id);
    }
  };

  const filterJobName = (jobs, job) => {
    return jobs.filter((j) => j.enrolled_time === job.pre_condition);
  };

  return (
    <tr onClick={handleTrClick} id={job.enrolled_time} key={job.enrolled_time}>
      <td>{job.name}</td>
      <td>
        {job.month
          ? `${alwaysFilter(job.month)}월 ${alwaysFilter(
              job.day
            )}일 ${alwaysFilter(job.hour)}시 ${alwaysFilter(job.minute)}분`
          : "-"}
      </td>
      <td>
        {filterJobName(jobs, job).length > 0
          ? filterJobName(jobs, job)[0].name
          : "-"}
      </td>
      <td>{job.route}</td>
      <td>
        <button>열기</button>
      </td>
      <td>
        <button onClick={handleUpdateClick} id={job.enrolled_time}>
          수정
        </button>
        <button onClick={handleDeleteClick} id={job.enrolled_time}>
          삭제
        </button>
      </td>
    </tr>
  );
};

export default TableRow;
