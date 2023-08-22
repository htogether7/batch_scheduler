import React, { useEffect } from "react";
import "./Pagination.css";

const Pagination = ({
  jobs,
  pageNum,
  setPageNum,
  //   sectionNnum,
  //   setSectionNum,
}) => {
  const handlePageButtonClick = (e) => {
    setPageNum(e.target.value - 1);
  };

  const handleSubPageClick = (e) => {
    if (pageNum !== 0) setPageNum((prev) => prev - 1);
  };
  const handleAddPageClick = (e) => {
    if (pageNum !== Math.ceil(jobs.length / 10) - 1)
      setPageNum((prev) => prev + 1);
  };

  return (
    <div>
      <button onClick={handleSubPageClick}>{"<"}</button>
      {new Array(Math.ceil(jobs.length / 10)).fill(0).map((_, index) => (
        <button
          onClick={handlePageButtonClick}
          value={index + 1}
          className={index === pageNum ? "active" : ""}
        >
          {index + 1}
        </button>
      ))}
      <button onClick={handleAddPageClick}>{">"}</button>
    </div>
  );
};

export default Pagination;
