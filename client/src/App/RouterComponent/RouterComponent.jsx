import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddEmployees from "../pages/AddEmployees/AddEmployees";
import EmployeeDetails from "../pages/EmployeeDetails/EmployeeDetails";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";

const RouterComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Add" element={<AddEmployees />} />
        <Route path="/employee-details" element={<EmployeeDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterComponent;
