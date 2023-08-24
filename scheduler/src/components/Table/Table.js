import React, { useEffect, useState } from "react";
import "./Table.css";
import axios from "axios";
import TableRow from "../TableRow/TableRow";
import Pagination from "../Pagination/Pagination";
import EmptyRow from "../TableRow/EmptyRow";

const Table = ({
  jobs,
  setJobs,
  mode,
  selectedCondition,
  setSelectedCondition,
  isEditting,
  setIsEditting,
  setMonthInput,
  setDayInput,
  setHourInput,
  setMinuteInput,
  setNameInput,
  setMode,
  fileInput,
  setFileMode,
  setRoute,
  setSelectedId,
  monthInput,
  pageNum,
  setPageNum,
  selectedNode,
  setSelectedNode,
  graph,
  setGraph,
}) => {
  const handleUpdateClick = (e) => {
    setMonthInput("");
    setDayInput("");
    setHourInput("");
    setMinuteInput("");
    setNameInput("");
    setRoute("");
    setSelectedCondition("");
    const selectedJob = jobs.filter((job) => job.name === e.target.name)[0];

    setSelectedId(selectedJob.enrolled_time);
    setNameInput(selectedJob.name);

    if (selectedJob.month) {
      setMonthInput(selectedJob.month);
      setDayInput(selectedJob.day);
      setHourInput(selectedJob.hour);
      setMinuteInput(selectedJob.minute);
    } else {
      setSelectedCondition(selectedJob.pre_condition || "");
    }

    if (selectedJob.month) {
      setMode("time");
    } else {
      setMode("condition");
    }

    setFileMode(false);
    setRoute(selectedJob.route);
    setIsEditting(true);
  };

  const handleDeleteClick = (e) => {
    const requestJobDelete = async () => {
      await axios
        .delete(
          `http://localhost:5050/job?name=${e.target.name}&id=${e.target.id}`
        )
        .then((res) => {
          setJobs(res.data);
          setGraph([]);
        });
    };
    requestJobDelete();
  };

  useEffect(() => {
    const request = async () => {
      await axios.get("http://localhost:5050/job").then((res) => {
        setJobs(res.data);
      });
    };
    request();
  }, []);

  return (
    <div>
      <div className="title">실행 대기중인 작업</div>
      <table>
        <tr>
          <th>이름</th>
          <th style={{ width: "200px" }}>실행 시간</th>
          <th>선행 조건</th>
          <th>파일명</th>
          <th>흐름도</th>
          <th>수정/삭제</th>
        </tr>
        {jobs.slice(pageNum * 10, pageNum * 10 + 10).map((job) => (
          <TableRow
            setSelectedCondition={setSelectedCondition}
            handleUpdateClick={handleUpdateClick}
            handleDeleteClick={handleDeleteClick}
            job={job}
            jobs={jobs}
            mode={mode}
            setSelectedNode={setSelectedNode}
            graph={graph}
            setGraph={setGraph}
          />
        ))}
        {new Array(10 - jobs.slice(pageNum * 10, pageNum * 10 + 10).length)
          .fill(0)
          .map(() => (
            <EmptyRow />
          ))}
      </table>
      <Pagination
        jobs={jobs}
        pageNum={pageNum}
        setPageNum={setPageNum}
        // sectionNum={sectionNum}
        // setSectionNum={setSectionNum}
      />
    </div>
  );
};

export default React.memo(Table);
