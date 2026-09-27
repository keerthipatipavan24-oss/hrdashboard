import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "./Header";

import "./Departments.css";

export default function Departments() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ==========================================
  // LOAD EMPLOYEES
  // ==========================================

  const loadEmployees = () => {
    try {
      const savedEmployees =
        localStorage.getItem("employees");

      if (savedEmployees) {
        const parsedEmployees =
          JSON.parse(savedEmployees);

        if (Array.isArray(parsedEmployees)) {
          setEmployees(parsedEmployees);
        } else {
          setEmployees([]);
        }
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error(
        "Error loading employees:",
        error
      );

      setEmployees([]);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadEmployees();

    const handleEmployeesUpdated = () => {
      loadEmployees();
    };

    window.addEventListener(
      "employeesUpdated",
      handleEmployeesUpdated
    );

    return () => {
      window.removeEventListener(
        "employeesUpdated",
        handleEmployeesUpdated
      );
    };
  }, []);

  // ==========================================
  // CREATE DEPARTMENT DATA
  // ==========================================

  const departmentMap = {};

  employees.forEach((employee) => {
    const department =
      employee.department?.trim();

    if (!department) {
      return;
    }

    if (!departmentMap[department]) {
      departmentMap[department] = [];
    }

    departmentMap[department].push(employee);
  });

  const departments = Object.keys(
    departmentMap
  )
    .sort()
    .map((department) => ({
      name: department,
      employees: departmentMap[department],
      count: departmentMap[department].length,
    }));

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredDepartments =
    departments.filter((department) =>
      department.name
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase().trim()
        )
    );

  // ==========================================
  // DEPARTMENT COLORS / ICONS
  // ==========================================

  const departmentStyles = [
    "department-purple",
    "department-blue",
    "department-green",
    "department-orange",
    "department-pink",
  ];

  const departmentIcons = [
    "💼",
    "💻",
    "📊",
    "🎯",
    "👥",
  ];

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="page-layout">

      <Sidebar />

      <div className="departments-main">

        <Header />

        <main className="page-content departments-content">

          {/* =====================================
              HEADER
          ===================================== */}

          <header className="departments-header">

            <div>

              <span className="departments-label">
                HR MANAGEMENT
              </span>

              <h1>
                Departments
              </h1>

              <p>
                View departments and employee
                distribution across the organization.
              </p>

            </div>

          </header>


          {/* =====================================
              DEPARTMENT SECTION
          ===================================== */}

          <section className="department-section">

            <div className="department-section-header">

              <div>

                <h2>
                  Department Directory
                </h2>

                <p>
                  {departments.length} departments
                  in your organization
                </p>

              </div>

              <span className="department-count">
                {departments.length} Total
              </span>

            </div>


            {/* =====================================
                SEARCH
            ===================================== */}

            <div className="department-search-area">

              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="department-search"
              />

            </div>


            {/* =====================================
                EMPTY STATE
            ===================================== */}

            {employees.length === 0 ? (

              <div className="department-empty">

                <div className="empty-icon">
                  🏢
                </div>

                <h3>
                  No Departments Found
                </h3>

                <p>
                  Add employees with department
                  information to see departments here.
                </p>

              </div>

            ) : filteredDepartments.length === 0 ? (

              <div className="department-empty">

                <div className="empty-icon">
                  🔍
                </div>

                <h3>
                  No Matching Departments
                </h3>

                <p>
                  Try searching for a different
                  department.
                </p>

              </div>

            ) : (

              /* =====================================
                 DEPARTMENT GRID
              ===================================== */

              <div className="department-grid">

                {filteredDepartments.map(
                  (department, index) => (

                    <article
                      className="department-card"
                      key={department.name}
                    >

                      {/* CARD TOP */}

                      <div className="department-card-top">

                        <div
                          className={`department-icon ${
                            departmentStyles[
                              index %
                                departmentStyles.length
                            ]
                          }`}
                        >
                          {
                            departmentIcons[
                              index %
                                departmentIcons.length
                            ]
                          }
                        </div>

                        <div className="department-card-title">

                          <h3>
                            {department.name}
                          </h3>

                          <p>
                            {department.count}{" "}
                            {department.count === 1
                              ? "Employee"
                              : "Employees"}
                          </p>

                        </div>

                      </div>


                      {/* DIVIDER */}

                      <div className="department-divider" />


                      {/* EMPLOYEE PREVIEW */}

                      <div className="department-members">

                        <span className="members-label">
                          Employees
                        </span>

                        {department.employees
                          .slice(0, 3)
                          .map((employee) => (

                            <div
                              className="department-member"
                              key={employee.id}
                            >

                              <div className="member-avatar">

                                {employee.name
                                  ? employee.name
                                      .charAt(0)
                                      .toUpperCase()
                                  : "E"}

                              </div>

                              <div className="member-info">

                                <strong>
                                  {employee.name}
                                </strong>

                                <span>
                                  {employee.designation ||
                                    "Employee"}
                                </span>

                              </div>

                            </div>

                          ))}

                      </div>


                      {/* MORE EMPLOYEES */}

                      {department.count > 3 && (

                        <div className="more-members">

                          +
                          {" "}
                          {department.count - 3}
                          {" "}
                          more employee
                          {department.count - 3 !== 1
                            ? "s"
                            : ""}

                        </div>

                      )}

                    </article>

                  )
                )}

              </div>

            )}

          </section>

        </main>

      </div>

    </div>
  );
} 