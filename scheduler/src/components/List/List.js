import React from "react";
import "./List.css";

const List = ({ jobList }) => {
  return (
    <>
      <div>작업 목록</div>
      <ul>
        {jobList.map((job) => (
          <li>{job}</li>
        ))}
      </ul>
    </>
  );
};
export default List;
