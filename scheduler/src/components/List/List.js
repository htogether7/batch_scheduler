import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import Li from "../Li/Li";

const List = ({
  jobs,
  setJobs,
  mode,
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
}) => {
  const handleUpdateClick = (e) => {
    setMonthInput("");
    setDayInput("");
    setHourInput("");
    setMinuteInput("");
    setNameInput("");
    setRoute("");
    setSelectedCondition("");
    const selectedJob = jobs.filter(
      (job) => job.enrolled_time === e.target.id
    )[0];
    setSelectedId(selectedJob.enrolled_time);
    setNameInput(selectedJob.name);
    if (selectedJob.pre_condition) {
      setSelectedCondition(selectedJob.pre_condition);
    } else {
      setMonthInput(selectedJob.month);
      setDayInput(selectedJob.day);
      setHourInput(selectedJob.hour);
      setMinuteInput(selectedJob.minute);
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
        .delete(`http://localhost:5050/job?id=${e.target.id}`)
        .then((res) => {
          setJobs(res.data);
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
    <>
      <div>실행 대기중인 작업</div>
      <ul>
        {jobs.map((job) => (
          <Li
            setSelectedCondition={setSelectedCondition}
            handleUpdateClick={handleUpdateClick}
            handleDeleteClick={handleDeleteClick}
            job={job}
            jobs={jobs}
            mode={mode}
          />
        ))}
      </ul>
    </>
  );
};

export default React.memo(List);
