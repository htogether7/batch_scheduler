import React from "react";
import "./Flow.css";
import Node from "../Node/Node";

const Flow = ({ selectedNode, graph }) => {
  return (
    <div className="flowContainer">
      <div className="title">작업 흐름</div>
      <div className="graphContainer">
        {graph.map((nodeArr) => (
          <div className="nodeContainer">
            {nodeArr.map((node) => (
              <Node content={node} selectedNode={selectedNode} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flow;
