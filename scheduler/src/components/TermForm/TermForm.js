import React, { useState } from "react";

const TermForm = ({ term, termInput, setTermInput }) => {
  const handleTermSubmit = (e) => {
    e.preventDefault();
    term.current = termInput;
    alert(`다음 작업들은 ${term.current}ms 간격으로 실행됩니다.`);
  };
  const handleChange = (e) => {
    setTermInput(e.target.value);
  };
  return (
    <>
      <form onSubmit={handleTermSubmit}>
        <div>Term 설정</div>
        <input type="text" onChange={handleChange} />
        <button type="submit">제출</button>
      </form>
    </>
  );
};

export default TermForm;
