import { BrowserRouter, Route, Routes } from "react-router-dom";

function layout() {
  return (
    <>
      <h1>嵌套路由实例</h1>
      <BrowserRouter>
        <Routes></Routes>
      </BrowserRouter>
    </>
  );
}

export default layout;
