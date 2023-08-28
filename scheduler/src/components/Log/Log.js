import React, { useEffect } from "react";
import "./Log.css";
import axios from "axios";

const Log = ({ log, setLog }) => {
  const requestLog = () => {
    axios.get("http://localhost:5050/log").then((res) => {
      console.log(res.data);
      setLog(res.data);
    });
  };

  useEffect(() => {
    requestLog();
  }, []);

  const handleRefreshClick = () => {
    requestLog();
  };

  return (
    <div className="logContainer">
      <div className="title">실행 로그</div>
      <div className="contentContainer">
        <button className="refreshButton" onClick={handleRefreshClick}>
          새로 고침
        </button>
        <div className="logContent">
          <ul>
            {log.map((l) => (
              <li>{l}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Log;
