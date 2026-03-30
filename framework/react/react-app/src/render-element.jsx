import React from "react";

function tick() {
  return <h2>现在是{new Date().toLocaleTimeString()}</h2>;
}

setInterval(tick, 1000);

export default tick;
