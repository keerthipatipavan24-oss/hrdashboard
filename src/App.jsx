import { BrowserRouter, Routes, Route } from "react-router-dom";


import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";
import Departments from "./pages/Departments";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Performance from "./pages/Performance";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Dashboard />} /> 

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/employees" element={<Employees />} />

        <Route path="/add-employee" element={<AddEmployee />} />

        <Route path="/edit-employee/:id" element={<EditEmployee />} />

        <Route path="/employee-details/:id" element={<EmployeeDetails />} />

        <Route path="/departments" element={<Departments />} />

        <Route path="/attendance" element={<Attendance />} />

        <Route path="/leave" element={<Leave />} />

        <Route path="/performance" element={<Performance />} />
      </Routes>
    </BrowserRouter>
  );
}
