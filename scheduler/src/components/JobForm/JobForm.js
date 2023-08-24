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
  isEditting,
  setIsEditting,
  monthInput,
  setMonthInput,
  dayInput,
  setDayInput,
  hourInput,
  setHourInput,
  minuteInput,
  setMinuteInput,
  nameInput,
  setNameInput,
  fileMode,
  setFileMode,
  route,
  setRoute,
  selectedId,
  setSelectedId,
}) => {
  const resetTimeInput = () => {
    setMonthInput("");
    setDayInput("");
    setHourInput("");
    setMinuteInput("");
  };

  const handleTimeButton = () => {
    setMode("time");
    setSelectedCondition("");
  };

  const handleConditionButton = () => {
    alert("실행 작업 대기 중인 작업 중 하나를 고르세요.");
    setMode("condition");
    resetTimeInput();
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

    if (jobs.filter((job) => job.name === nameInput).length > 0) {
      alert("같은 이름을 가진 작업이 존재합니다!");
      return;
    }
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
            route: route.split("\\")[2],
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
          route: route.split("\\")[2],
        })
        .then((res) => {
          setJobs([...jobs, res.data]);
        });
    }
  };

  const handleJobUpdate = (e) => {
    e.preventDefault();

    if (
      jobs.filter(
        (job) => job.name === nameInput && job.enrolled_time !== selectedId
      ).length > 0
    ) {
      alert("같은 이름을 가진 작업이 존재합니다!");
      return;
    }
    axios
      .put(`http://localhost:5050/job?id=${selectedId}`, {
        month: monthInput,
        day: dayInput,
        hour: hourInput,
        minute: minuteInput,
        route: route,
        pre_condition: selectedCondition,
        name: nameInput,
      })
      .then((res) => {
        setJobs(res.data);
        setIsEditting(false);
        setNameInput("");
        resetTimeInput();
        setRoute("");
        setSelectedCondition("");
      });
  };

  const handleGraph = () => {};

  const handleFileChange = (e) => {
    setRoute(e.target.value);
  };

  const handleCancelClick = () => {
    resetTimeInput();
    setNameInput("");
    setRoute("");
    setSelectedCondition("");
    setSelectedId("");
    setIsEditting(false);
  };

  return (
    <div>
      <div className="title">{isEditting ? "작업 수정" : "작업 등록"}</div>
      <div className="formContainer">
        <form onSubmit={isEditting ? handleJobUpdate : handleJobSubmit}>
          <div>
            <label for="nameInput">이름</label>
            <input
              id="nameInput"
              type="text"
              required
              onChange={handleNameInput}
              value={nameInput}
            />
          </div>
          <div>
            <button
              type="button"
              onClick={handleTimeButton}
              disabled={isEditting ? true : false}
            >
              주기
            </button>
            <button
              type="button"
              onClick={handleConditionButton}
              disabled={isEditting ? true : false}
            >
              조건
            </button>
          </div>
          {mode === "time" ? (
            <div>
              <TimeInput
                id="month"
                content="월"
                func={setMonthInput}
                value={monthInput}
                required
              />
              <TimeInput
                id="day"
                content="일"
                func={setDayInput}
                value={dayInput}
                required
              />
              <TimeInput
                id="hour"
                content="시"
                func={setHourInput}
                value={hourInput}
                required
              />
              <TimeInput
                id="minute"
                content="분"
                func={setMinuteInput}
                value={minuteInput}
                required
              />
            </div>
          ) : (
            <>
              <label for="conditionInput">선행 조건</label>
              <input
                id="conditionInput"
                type="text"
                onChange={handleConditionInput}
                required
                value={selectedCondition || ""}
                disabled
              />
            </>
          )}
          {!isEditting ? (
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              required
            />
          ) : !fileMode ? (
            <button
              type="button"
              onClick={() => {
                setFileMode(true);
              }}
            >
              Update File
            </button>
          ) : (
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              required
            />
          )}
          <button type="submit">제출</button>
          <button type="button" onClick={handleCancelClick}>
            취소
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
