import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import List from "./components/List/List";
import JobForm from "./components/JobForm/JobForm";
import TermForm from "./components/TermForm/TermForm";

function App() {
  const [jobList, setJobList] = useState([1, 2]);
  const [mode, setMode] = useState("time");

  // 처음 마운트 되었을 때 DB로 부터 JobList를 불러옴

  useEffect(() => {
    axios.get("http://localhost:5050/api").then((r) => console.log(r.data));
  });
  return (
    <div className="App">
      <List jobList={jobList} />
      <TermForm />
      <JobForm mode={mode} />
    </div>
  );
}

export default App;
