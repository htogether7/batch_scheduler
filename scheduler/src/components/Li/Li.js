import React from "react";

const Li = ({ handleDeleteClick, handleUpdateClick, handleLiClick, job }) => {
  return (
    <li onClick={handleLiClick} key={job.enrolled_time} id={job.enrolled_time}>
      {/* <div id={job.enrolled_time}>
        {job.name} {job.pre_condition} {job.month} {job.day} {job.hour}{" "}
        {job.minute}
      </div> */}
      {/* {job.month ? (
        <div id={job.enrolled_time}>
          <div>{job.name}</div>
        </div>
      ) : (
        <div id={job.enrolled_time}>
          <div>{job.name}</div>
        </div>
      )} */}
      <div id={job.enrolled_time}>
        <div>{job.name}</div>
        {job.month
          ? `실행 시간 :${job.month}월 ${job.day}일 ${job.hour}시 ${job.minute}분`
          : `선행 조건 : ${job.pre_condition}`}
      </div>
      <button onClick={handleUpdateClick} id={job.enrolled_time}>
        수정
      </button>
      <button onClick={handleDeleteClick} id={job.enrolled_time}>
        삭제
      </button>
    </li>
  );
};

export default Li;
