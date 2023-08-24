import "./App.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import JobForm from "./components/JobForm/JobForm";
import Table from "./components/Table/Table";
import Flow from "./components/Flow/Flow";
// import TermForm from "./components/TermForm/TermForm";

function App() {
  const [submittedJobs, setSubmittedJobs] = useState([]);
  const [mode, setMode] = useState("time");
  // const [termInput, setTermInput] = useState(0);
  const [selectedCondition, setSelectedCondition] = useState("");
  // const term = useRef(30000);
  const [isEditting, setIsEditting] = useState(false);
  const [monthInput, setMonthInput] = useState("");
  const [dayInput, setDayInput] = useState("");
  const [hourInput, setHourInput] = useState("");
  const [minuteInput, setMinuteInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [fileMode, setFileMode] = useState(false);
  const [route, setRoute] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [pageNum, setPageNum] = useState(0);
  const [selectedNode, setSelectedNode] = useState("");
  const [graph, setGraph] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5050/job")
      .then((res) => setSubmittedJobs(res.data));
  }, []);

  return (
    <div className="App">
      <div className="totalContainer">
        <Table
          jobs={submittedJobs}
          setJobs={setSubmittedJobs}
          mode={mode}
          selectedCondition={selectedCondition}
          setSelectedCondition={setSelectedCondition}
          isEditting={isEditting}
          setIsEditting={setIsEditting}
          setMonthInput={setMonthInput}
          setDayInput={setDayInput}
          setHourInput={setHourInput}
          setMinuteInput={setMinuteInput}
          setNameInput={setNameInput}
          setMode={setMode}
          setFileMode={setFileMode}
          setRoute={setRoute}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          monthInput={monthInput}
          pageNum={pageNum}
          setPageNum={setPageNum}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          graph={graph}
          setGraph={setGraph}
        />
        <div className="funcContainer">
          <JobForm
            mode={mode}
            setMode={setMode}
            selectedCondition={selectedCondition}
            setSelectedCondition={setSelectedCondition}
            jobs={submittedJobs}
            setJobs={setSubmittedJobs}
            isEditting={isEditting}
            setIsEditting={setIsEditting}
            monthInput={monthInput}
            setMonthInput={setMonthInput}
            dayInput={dayInput}
            setDayInput={setDayInput}
            hourInput={hourInput}
            setHourInput={setHourInput}
            minuteInput={minuteInput}
            setMinuteInput={setMinuteInput}
            nameInput={nameInput}
            setNameInput={setNameInput}
            fileMode={fileMode}
            setFileMode={setFileMode}
            route={route}
            setRoute={setRoute}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
          <Flow selectedNode={selectedNode} graph={graph} />
        </div>
      </div>
    </div>
  );
}

export default App;
