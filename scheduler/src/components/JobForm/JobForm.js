import React from "react";
import "./JobForm.css";
import TimeInput from "../TimeInput/TimeInput";

const JobForm = ({ mode, setMode }) => {
  const handleTimeButton = () => {
    setMode("time");
  };
  const handleConditionButton = () => {
    setMode("condition");
  };
  return (
    <>
      <form>
        <div>작업 등록</div>
        <input type="text" required />
        <br></br>
        <button type="button" onClick={handleTimeButton}>
          주기
        </button>
        <button type="button" onClick={handleConditionButton}>
          조건
        </button>
        <br></br>
        {mode === "time" ? (
          <>
            <TimeInput id="month" content="월" />
            <TimeInput id="day" content="일" />
            <TimeInput id="hour" content="시" />
            <TimeInput id="minute" content="분" />
          </>
        ) : (
          <>
            <label for="conditionInput">선행 조건</label>
            <input id="conditionInput" type="text" />
          </>
        )}
        <button type="submit">제출</button>
      </form>
      <button className="resetButton">전체 작업 초기화</button>
    </>
  );
};

export default JobForm;
