import React from "react";

const TimeInput = ({ id, content, func, value }) => {
  const funcFormat = (e) => {
    func(e.target.value);
  };

  return (
    <>
      <label for={id}>{content}</label>
      <input
        id={id}
        className="timeInput"
        type="text"
        onChange={funcFormat}
        value={value}
      />
    </>
  );
};

export default TimeInput;
