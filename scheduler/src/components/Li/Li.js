import React from "react";

const Li = ({
  handleDeleteClick,
  handleUpdateClick,
  job,
  jobs,
  setSelectedCondition,
  mode,
}) => {
  const handleLiClick = (e) => {
    if (mode === "condition") {
      setSelectedCondition(e.target.id);
    }
  };
  return (
    <li onClick={handleLiClick} key={job.enrolled_time} id={job.enrolled_time}>
      <div id={job.enrolled_time}>
        <div id={job.enrolled_time}>{job.name}</div>
        <div id={job.enrolled_time}>
          {job.month
            ? `실행 시간 :${job.month}월 ${job.day}일 ${job.hour}시 ${job.minute}분`
            : `선행 조건 : ${
                jobs.filter((obj) => obj.enrolled_time === job.pre_condition)[0]
                  ? jobs.filter(
                      (obj) => obj.enrolled_time === job.pre_condition
                    )[0].name
                  : "선행 조건이 제거되어 실행 불가"
              }`}
        </div>
        <div id={job.enrolled_time}>실행 파일 : ${job.route}</div>
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
