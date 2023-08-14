import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";

const List = ({ jobs, setJobs, mode, setSelectedCondition }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLiClick = (e) => {
    if (mode === "condition") {
      setSelectedCondition(e.target.id);
    }
  };

  const handleUpdateClick = () => {};

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
          <li key={job.enrolled_time}>
            <div onClick={handleLiClick} id={job.enrolled_time}>
              {job.name} {job.pre_condition} {job.month} {job.day} {job.hour}{" "}
              {job.minute}
            </div>
            <button onClick={handleUpdateClick}>수정</button>
            <button onClick={handleDeleteClick} id={job.enrolled_time}>
              삭제
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default React.memo(List);
