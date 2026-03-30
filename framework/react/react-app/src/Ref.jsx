import { useEffect, useRef } from "react";

function Ref() {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.placeholder = "input please...";
  });
  return (
    <>
      <input type="text" ref={inputRef} />
    </>
  );
}

export default Ref;
