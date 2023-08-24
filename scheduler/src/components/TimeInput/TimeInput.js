import React from "react";

const TimeInput = ({ id, content, func, value }) => {
  const funcFormat = (e) => {
    return func(e.target.value);
  };

  return (
    <>
      <input
        id={id}
        className="timeInput"
        type="text"
        onChange={funcFormat}
        value={value}
      />
      <label for={id}>{content}</label>
    </>
  );
};

export default TimeInput;
