import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Hello from "./hello.jsx";
import EventHandling from "./event-handling.jsx";
import RenderElement from "./render-element.jsx";
import JSX from "./views/describing-the-ui/writing-markup-with-jsx/JSX.jsx";
import Expression from "./expression.jsx";
import Style from "./style.jsx";
import Comment from "./comment.jsx";
import Array from "./array.jsx";
import Props from "./props/props.jsx";
import DestructProps from "./props/destructure-props.jsx";
import ClassCom from "./class-com.jsx";
import LifeCycle from "./life-cycle.jsx";
import Events from "./props/events.jsx";
import RenderingLists from "./views/describing-the-ui/rendering-lists/rendering-lists.jsx";
import FormInputBindings from "./form-input-bindings.jsx";
import Fetch from "./fetch.jsx";
import Ref from "./ref.jsx";
import router from "./router/index.jsx";
import { RouterProvider, Link } from "react-router-dom";
import CSS from "./style/css.jsx";
import Sass from "./style/sass.jsx";

function App() {
  const [count, setCount] = useState(0);
  let [char, setChar] = useState("!");

  function onAnswerNo(e) {
    console.log("onAnswerNo", e);
  }

  function onAnswerYes(e) {
    console.log("onAnswerYes", e);
  }
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Hello, Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {/* <Hello />
      <Hello></Hello>
      <EventHandling />
      <RenderElement />
      <JSX />
      <Expression />
      <Style />
      <Comment />
      <Array />
      <Props name={"React" + char} />
      <button onClick={() => setChar((char += "!"))}>!</button>
      <DestructProps firstName="Tim" lastName="Cook" />
      <ClassCom />
      <LifeCycle />
      <Events onYes={onAnswerYes} onNo={onAnswerNo} />
      <RenderingLists />
      <FormInputBindings />
      <Fetch />
      <Ref />
      <CSS />
      <Sass /> */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
