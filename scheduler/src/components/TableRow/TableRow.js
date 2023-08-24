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

  const handleTableDivClick = (e) => {
    if (mode === "condition") {
      setSelectedCondition(e.target.parentElement.parentElement.id);
    }
  };

  const filterJobName = (jobs, job) => {
    return jobs.filter((j) => j.name === job.pre_condition);
  };

  const addhandleDivClick = (content) => {
    return <div onClick={handleTableDivClick}>{content}</div>;
  };

  return (
    <tr id={job.name} key={job.enrolled_time} className="fill">
      <td>{addhandleDivClick(job.name)}</td>
      <td>
        {addhandleDivClick(
          job.month
            ? `${alwaysFilter(job.month)}월 ${alwaysFilter(
                job.day
              )}일 ${alwaysFilter(job.hour)}시 ${alwaysFilter(job.minute)}분`
            : "-"
        )}
      </td>
      <td>
        {addhandleDivClick(
          filterJobName(jobs, job).length > 0
            ? filterJobName(jobs, job)[0].name
            : "-"
        )}
      </td>
      <td>{addhandleDivClick(job.route)}</td>
      <td>
        {addhandleDivClick(
          <div onClick={handleTableDivClick}>
            <button>열기</button>
          </div>
        )}
      </td>
      <td>
        {addhandleDivClick(
          <div onClick={handleTableDivClick}>
            <button onClick={handleUpdateClick} name={job.name}>
              수정
            </button>
            <button onClick={handleDeleteClick} name={job.name}>
              삭제
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default TableRow;
