import "./App.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import List from "./components/List/List";
import JobForm from "./components/JobForm/JobForm";
import TermForm from "./components/TermForm/TermForm";

function App() {
  const [submittedJobs, setSubmittedJobs] = useState([]);
  const [mode, setMode] = useState("time");
  const [termInput, setTermInput] = useState(0);
  const [selectedCondition, setSelectedCondition] = useState("");
  const term = useRef(10000);
  const [isEditting, setIsEditting] = useState(false);
  const [monthInput, setMonthInput] = useState("");
  const [dayInput, setDayInput] = useState("");
  const [hourInput, setHourInput] = useState("");
  const [minuteInput, setMinuteInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [fileMode, setFileMode] = useState(false);
  const [route, setRoute] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const infiniteCheck = async (term) => {
    const roofTerm = term;
    while (true) {
      if (roofTerm !== term) break;
      await new Promise((r) => setTimeout(r, term.current)).then(() => {
        console.log(`now term : ${term.current}, time : ${Date.now()}`);
        axios
          .post("http://localhost:5050/batch", { time: Date.now() })
          .then((res) => console.log(res.data));
      });
    }
  };

  // 처음 마운트 되었을 때 DB로 부터 JobList를 불러옴
  useEffect(() => {
    infiniteCheck(term);
  }, [term]);

  return (
    <div className="App">
      <List
        jobs={submittedJobs}
        setJobs={setSubmittedJobs}
        mode={mode}
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
      />
      <TermForm term={term} termInput={termInput} setTermInput={setTermInput} />
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
    </div>
  );
}

export default App;
