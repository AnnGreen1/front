import React, { useState } from "react";

function expression() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  return (
    <>
      <span>{1 + 1}</span>
      <br />
      a+b:<span>{a + b}</span>
      <button onClick={() => setA(a + 1)}>setA(a+1)</button>
      <button onClick={() => setB(b + 2)}>setB(b+2)</button>
    </>
  );
}

export default expression;
