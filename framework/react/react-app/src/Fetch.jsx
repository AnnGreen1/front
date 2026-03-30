import { useEffect, useState } from "react";
import axios from "axios";

function Fetch() {
  const [qinghua, setQinghua] = useState("");

  function randQinghua() {
    axios
      .post("/api/rand.qinghua")
      .then(function (response) {
        console.log(response);
        setQinghua(response.data.content);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function fetchQinghua() {
    fetch("/api/rand.qinghua").then((res) => {
      console.log(res);
      console.log(res.json());
    });
  }

  return (
    <>
      <p>I want talk some words to you,"{qinghua}"</p>
      <button onClick={randQinghua}>again</button>
      <button onClick={fetchQinghua}>fetchQinghua</button>
    </>
  );
}

export default Fetch;
