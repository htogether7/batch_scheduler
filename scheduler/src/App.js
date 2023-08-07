import "./App.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import List from "./components/List/List";
import JobForm from "./components/JobForm/JobForm";
import TermForm from "./components/TermForm/TermForm";

function App() {
  const [submittedJobs, setSubmittedJobs] = useState([1, 2, 3]);
  const [mode, setMode] = useState("time");
  const term = useRef(1000);
  const [termInput, setTermInput] = useState(0);

  const infiniteCheck = async (term) => {
    const roofTerm = term;
    while (true) {
      if (roofTerm !== term) break;
      await new Promise((r) => setTimeout(r, term.current)).then(() =>
        console.log(`now term : ${term.current}, time : ${Date.now()}`)
      );
    }
  };

  // 처음 마운트 되었을 때 DB로 부터 JobList를 불러옴

  useEffect(() => {
    infiniteCheck(term);
  }, [term]);

  return (
    <div className="App">
      <List jobs={submittedJobs} />
      <TermForm term={term} termInput={termInput} setTermInput={setTermInput} />
      <JobForm mode={mode} />
    </div>
  );
}

export default App;
