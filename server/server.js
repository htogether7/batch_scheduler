const express = require("express");
const app = express();
const cors = require("cors");

const port = 5050; // 노드 서버가 작동할 포트넘버
app.use(cors());

// app.use(bodyParser.json());
app.use("/api", (req, res) => res.json({ username: "bryan" }));

app.listen(port, () => {
  console.log(`express is running on ${port}`);
});
