import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";

const List = ({ jobs, setJobs, mode, setSelectedCondition }) => {
  const handleLiClick = (e) => {
    if (mode === "condition") {
      setSelectedCondition(e.target.id);
    }
  };

  useEffect(() => {
    const request = async () => {
      await axios.get("http://localhost:5050/job").then((res) => {
        console.log(res.data);
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
          <li key={job.enrolled_time}>
            <div onClick={handleLiClick} id={job.enrolled_time}>
              {job.name} {job.pre_condition} {job.month} {job.day} {job.hour}{" "}
              {job.minute}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default React.memo(List);
