import React from "react";

const TimeInput = ({ id, content }) => {
  return (
    <>
      <label for={id}>{content}</label>
      <input id={id} className="timeInput" type="text" />
    </>
  );
};

export default TimeInput;
