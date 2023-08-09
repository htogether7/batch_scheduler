import React, { useState } from "react";

const TermForm = ({ term, termInput, setTermInput }) => {
  const validateTerm = (termInput) => {
    return isNaN(termInput)
      ? false
      : parseInt(termInput) < 10000
      ? false
      : true;
  };

  const handleTermSubmit = (e) => {
    e.preventDefault();
    if (validateTerm(termInput)) {
      if (term.current === termInput) {
        alert("이전과 같은 값입니다.");
      } else {
        term.current = termInput;
        alert(`다음 작업들은 ${termInput}ms 간격으로 실행됩니다.`);
      }
    } else {
      alert("잘못된 입력이거나 너무 짧은 시간입니다.");
    }
  };

  const handleChange = (e) => {
    setTermInput(e.target.value);
  };

  return (
    <>
      <form onSubmit={handleTermSubmit}>
        <div>Term 설정</div>
        <input type="text" onChange={handleChange} placeholder="10000ms 이상" />
        <button type="submit">제출</button>
      </form>
    </>
  );
};

export default TermForm;
