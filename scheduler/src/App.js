import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import List from "./components/List/List";
import JobForm from "./components/JobForm/JobForm";
import TermForm from "./components/TermForm/TermForm";

function App() {
  const [submittedJobs, setSubmittedJobs] = useState([1, 2, 3]);
  const [mode, setMode] = useState("time");
  const [term, setTerm] = useState(1000);

  const infiniteCheck = async (term) => {
    while (true) {
      await new Promise((r) => setTimeout(r, term)).then(() =>
        console.log(`now term : ${term}, time : ${Date.now()}`)
      );
    }
  };

  // 처음 마운트 되었을 때 DB로 부터 JobList를 불러옴

  // useEffect(() => {
  //   axios.get("http://localhost:5050/api").then((r) => console.log(r.data));
  // });
  useEffect(() => {
    infiniteCheck(term);
  });
  return (
    <div className="App">
      <List jobs={submittedJobs} />
      <TermForm />
      <JobForm mode={mode} />
    </div>
  );
}

export default App;
