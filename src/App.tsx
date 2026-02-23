import React from "react";
import { Route, Routes } from "react-router";
import { MainPage } from "./pages/MainPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const App = () => {
  return (
    <Routes>
      <React.Fragment>
        <Route element={<MainPage />} path="/" />
        <Route element={<NotFoundPage />} path="*" />
      </React.Fragment>
    </Routes>
  );
};

export default App;
