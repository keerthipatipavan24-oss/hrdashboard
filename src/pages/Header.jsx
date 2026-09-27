import { useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const location = useLocation();

  const pageNames = {
    "/": "Dashboard",
    "/dashboard": "Dashboard",
    "/employees": "Employees",
    "/departments": "Departments",
    "/attendance": "Attendance",
    "/leave": "Leave",
    "/performance": "Performance",
  };

  let currentPage = pageNames[location.pathname];

  // Employee-related pages
  if (
    location.pathname.startsWith("/add-employee") ||
    location.pathname.startsWith("/edit-employee") ||
    location.pathname.startsWith("/employee-details")
  ) {
    currentPage = "Employees";
  }

  // Default page name
  if (!currentPage) {
    currentPage = "Dashboard";
  }

  return (
    <header className="app-header">

      <div className="header-left">

        <div className="header-brand">
          HR PORTAL
        </div>

        <div className="header-divider">
          /
        </div>

        <div className="header-page">
          {currentPage}
        </div>

      </div>

      <div className="header-right">

        <div className="header-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Find employees, reports..."
          />
        </div>

        <button className="header-action">
          ⌁
        </button>

        <div className="header-avatar">
          PV
        </div>

      </div>

    </header>
  );
}  