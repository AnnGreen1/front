import React from "react";

function Style() {
  const styleObj = {
    color: "hotpink",
    fontSize: 20,
  };

  return (
    <>
      <div>
        <span>没有样式</span>
        <span style={styleObj}>具有样式</span>
      </div>
    </>
  );
}


export default Style