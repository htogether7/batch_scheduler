import React from "react";
import "./TableRow.css";
import axios from "axios";

const TableRow = ({
  handleDeleteClick,
  handleUpdateClick,
  job,
  jobs,
  setSelectedCondition,
  mode,
  setSelectedNode,
  graph,
  setGraph,
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

  const handleFlowClick = (e) => {
    axios.get(`http://localhost:5050/flow?name=${e.target.id}`).then((res) => {
      setGraph([res.data.pre, res.data.curr, res.data.post]);
    });
    setSelectedNode(e.target.id);
  };

  return (
    <tr id={job.name} key={job.enrolled_time} className="fill">
      <td>
        <b>{addhandleDivClick(job.name)}</b>
      </td>
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
            <button onClick={handleFlowClick} id={job.name}>
              보기
            </button>
          </div>
        )}
      </td>
      <td>
        {addhandleDivClick(
          <div onClick={handleTableDivClick}>
            <button onClick={handleUpdateClick} name={job.name}>
              수정
            </button>
            <button
              onClick={handleDeleteClick}
              name={job.name}
              id={job.enrolled_time}
            >
              삭제
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default TableRow;
