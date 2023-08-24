import React from "react";
import "./Node.css";

const Node = ({ content, selectedNode }) => {
  return (
    <div className={`node ${selectedNode === content ? "selected" : ""}`}>
      {content}
    </div>
  );
};

export default Node;
