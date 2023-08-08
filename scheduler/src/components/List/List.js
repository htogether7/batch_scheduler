import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";

const List = ({ jobs, setJobs, mode, setSelectedCondition }) => {
  // const [jobList, setJobList] = useState([]);
  const handleLiClick = (e) => {
    if (mode === "condition") {
      setSelectedCondition(e.target.id);
    }
  };

  const hasSameValue = (l1, l2) => {
    if (l1.length !== l2.legnth) return false;
    for (let index = 0; index < l1.length; index++) {
      // l1[index];
      for (let key of Object.keys(l1)) {
        if (l1[index][key] !== l2[index][key]) return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const request = async () => {
      // const prevJobs = jobs;
      await axios.get("http://localhost:5050/job").then((res) => {
        // if (prevJobs !== jobs) {
        // if (!hasSameValue(prevJobs, res.data)) {
        setJobs(res.data);
        // }
        // }
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
