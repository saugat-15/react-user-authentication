import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Login, Signup } from "./pages";
import { routes } from "./utils/routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Login />} path={routes.login} />
        <Route element={<Signup />} path={routes.signup} />
        <Route element={<Home />} path={routes.home} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
