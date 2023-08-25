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

  const handleTrClick = (e) => {
    if (mode === "condition") {
      setSelectedCondition(e.target.id);
    }
  };
  const filterJobName = (jobs, job) => {
    return jobs.filter((j) => j.name === job.pre_condition);
  };

  const Td = (id, content) => {
    return (
      <td id={id}>
        <div id={id}>{content}</div>
      </td>
    );
  };

  const handleFlowClick = (e) => {
    axios.get(`http://localhost:5050/flow?name=${e.target.id}`).then((res) => {
      setGraph([res.data.pre, res.data.curr, res.data.post]);
    });
    setSelectedNode(e.target.id);
  };

  return (
    <tr
      id={job.name}
      key={job.enrolled_time}
      className="fill"
      onClick={handleTrClick}
    >
      {Td(job.name, job.name)}
      {Td(
        job.name,
        job.month
          ? `${alwaysFilter(job.month)}월 ${alwaysFilter(
              job.day
            )}일 ${alwaysFilter(job.hour)}시 ${alwaysFilter(job.minute)}분`
          : "-"
      )}
      {Td(
        job.name,
        filterJobName(jobs, job).length > 0
          ? filterJobName(jobs, job)[0].name
          : "-"
      )}
      {Td(job.name, job.route)}
      {Td(
        job.name,
        <div>
          <button onClick={handleFlowClick} id={job.name}>
            보기
          </button>
        </div>
      )}
      {Td(
        job.name,
        <div>
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
    </tr>
  );
};

export default TableRow;
