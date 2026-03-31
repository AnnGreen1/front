import React from "react";

function Events({ onYes, onNo }) {
  return (
    <>
      <p>Are you OK?</p>
      <button onClick={() => onYes("😀")}>yes</button>
      <button onClick={() => onNo("🙁")}>No</button>
    </>
  );
}

export default Events;
