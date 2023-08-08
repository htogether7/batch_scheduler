import React, { useEffect, useState } from "react";
import axios from "axios";
import "./JobForm.css";
import TimeInput from "../TimeInput/TimeInput";
import Objects from "../../Object";

const JobForm = ({
  mode,
  setMode,
  selectedCondition,
  setSelectedCondition,
  jobs,
  setJobs,
}) => {
  const [monthInput, setMonthInput] = useState("");
  const [dayInput, setDayInput] = useState("");
  const [hourInput, setHourInput] = useState("");
  const [minuteInput, setMinuteInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  // const [conditionInput, setConditionInput] = useState("");

  const handleTimeButton = () => {
    setMode("time");
  };

  const handleConditionButton = () => {
    setMode("condition");
  };

  const handleNameInput = (e) => {
    setNameInput(e.target.value);
  };

  const handleConditionInput = (e) => {
    setSelectedCondition(e.target.value);
  };

  const validateTime = (month, day, hour, minute) => {
    if (
      (isNaN(month) && month !== "*") ||
      (!isNaN(month) && !(month in Objects.monthDict))
    )
      return false;
    if (
      (isNaN(day) && day !== "*") ||
      (!isNaN(day) && (day <= 0 || day > Objects.monthDict[month]))
    )
      return false;
    if (
      (isNaN(hour) && hour !== "*") ||
      (!isNaN(hour) && (hour < 0 || hour > 23))
    )
      return false;
    if (
      (isNaN(minute) && minute !== "*") ||
      (!isNaN(minute) && (minute < 0 || minute > 59))
    )
      return false;

    return true;
  };

  const handleJobSubmit = (e) => {
    e.preventDefault();
    const now = Date.now().toString();
    if (mode === "time") {
      if (validateTime(monthInput, dayInput, hourInput, minuteInput)) {
        axios
          .post("http://localhost:5050/job", {
            name: nameInput,
            month: monthInput,
            day: dayInput,
            hour: hourInput,
            minute: minuteInput,
            enrolled_time: now,
          })
          .then((res) => setJobs([...jobs, res.data]));
      } else {
        alert("시간을 다시한번 확인해주세요");
      }
    } else {
      axios
        .post("http://localhost:5050/job", {
          name: nameInput,
          pre_condition: selectedCondition,
          enrolled_time: now,
        })
        .then((res) => {
          setJobs([...jobs, res.data]);
        });
    }
  };

  return (
    <>
      <form onSubmit={handleJobSubmit}>
        <div>작업 등록</div>
        <input type="text" required onChange={handleNameInput} />
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
            <TimeInput id="month" content="월" func={setMonthInput} required />
            <TimeInput id="day" content="일" func={setDayInput} required />
            <TimeInput id="hour" content="시" func={setHourInput} required />
            <TimeInput
              id="minute"
              content="분"
              func={setMinuteInput}
              required
            />
          </>
        ) : (
          <>
            <label for="conditionInput">선행 조건</label>
            <input
              id="conditionInput"
              type="text"
              onChange={handleConditionInput}
              required
              value={selectedCondition}
            />
          </>
        )}
        <button type="submit">제출</button>
      </form>
      <button className="resetButton">전체 작업 초기화</button>
    </>
  );
};

export default JobForm;
