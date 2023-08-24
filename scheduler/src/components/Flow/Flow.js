import React from "react";
import "./Flow.css";
import Node from "../Node/Node";

const Flow = ({ selectedNode, graph }) => {
  return (
    <div className="flowContainer">
      <div className="title">작업 흐름</div>
      <div className="graphContainer">
        {graph.map((nodeArr, i) => (
          <div>
            <div className="nodeContainer">
              {nodeArr.map((node) => (
                <Node content={node} selectedNode={selectedNode} />
              ))}
            </div>
            {nodeArr.length > 0 && i !== 2 && graph[i + 1].length > 0 ? (
              <div>↓</div>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flow;
