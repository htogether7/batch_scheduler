import React, { useEffect } from "react";
import "./List.css";
import axios from "axios";

const List = ({ jobs, setJobs }) => {
  useEffect(() => {
    axios.get("http://localhost:5050/job").then((res) => {
      setJobs(res.data);
    });
  }, [jobs]);

  return (
    <>
      <div>실행 대기중인 작업</div>
      <ul>
        {jobs.map((job) => (
          <li key={job.enrolled_time}>
            {job.name} {job.pre_condition} {job.month} {job.day} {job.hour}{" "}
            {job.minute}
          </li>
        ))}
      </ul>
    </>
  );
};
export default List;
