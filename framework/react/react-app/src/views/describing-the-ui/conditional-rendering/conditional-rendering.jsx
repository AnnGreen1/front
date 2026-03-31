function ConditionRendering(props) {
  let res = "";
  if (props.num % 2 == 0) {
    res = "even number";
  } else {
    res = "odd number";
  }

  return (
    <>
      is {res}, {props.num % 2 == 0 ? "Yes" : "No"}
    </>
  );
}

export default ConditionRendering;
