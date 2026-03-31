import React, { useState } from "react";

function EventHandling() {
  const handleClick = (e) => {
    console.log(e);
  };

  const [count, setCount] = useState(0);
  const handleClickParam = () => {
    setCount(count + 1);
  };

  const handleClickParam2 = (val) => {
    console.log(val);
  };

  return (
    <>
      {count}
      <h1 onClick={handleClick}>click me</h1>
      <h2 onClick={handleClickParam}>a param</h2>
      <h2 onClick={() => handleClickParam2(2)}>coustom param</h2>
    </>
  );
}

export default EventHandling;
