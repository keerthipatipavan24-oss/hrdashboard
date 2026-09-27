import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "./Header";

import Toast from "./Toast";

import "./Attendance.css";

export default function Attendance() {
  // ==========================================
  // EMPLOYEES
  // ==========================================

  const [employees, setEmployees] = useState([]);

  // ==========================================
  // DATE
  // ==========================================

  const getToday = () => {
    const date = new Date();

    return date.toISOString().split("T")[0];
  };

  const [selectedDate, setSelectedDate] =
    useState(getToday());

  // ==========================================
  // ATTENDANCE
  // ==========================================

  const [attendance, setAttendance] = useState({});

  // ==========================================
  // FILTERS
  // ==========================================

  const [searchTerm, setSearchTerm] = useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  // ==========================================
  // TOAST
  // ==========================================

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

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

      setToast({
        message: "Unable to load employees.",
        type: "error",
      });
    }
  };

  // ==========================================
  // LOAD ATTENDANCE
  // ==========================================

  const loadAttendance = () => {
    try {
      const savedAttendance =
        localStorage.getItem("attendance");

      if (savedAttendance) {
        const parsedAttendance =
          JSON.parse(savedAttendance);

        setAttendance(
          parsedAttendance || {}
        );
      } else {
        setAttendance({});
      }
    } catch (error) {
      console.error(
        "Error loading attendance:",
        error
      );

      setAttendance({});
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadEmployees();
    loadAttendance();

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
  // CURRENT DAY ATTENDANCE
  // ==========================================

  const todayAttendance =
    attendance[selectedDate] || {};

  // ==========================================
  // MARK ATTENDANCE
  // ==========================================

  const markAttendance = (
    employeeId,
    status
  ) => {
    const updatedAttendance = {
      ...attendance,

      [selectedDate]: {
        ...(attendance[selectedDate] || {}),
        [employeeId]: status,
      },
    };

    setAttendance(updatedAttendance);

    localStorage.setItem(
      "attendance",
      JSON.stringify(updatedAttendance)
    );

    setToast({
      message: `Attendance marked as ${status}.`,
      type: "success",
    });

    // Update Dashboard and other pages
    window.dispatchEvent(
      new Event("attendanceUpdated")
    );
  };

  // ==========================================
  // FILTER EMPLOYEES
  // ==========================================

  const filteredEmployees =
    employees.filter((employee) => {
      const search =
        searchTerm
          .toLowerCase()
          .trim();

      const matchesSearch =
        employee.name
          ?.toLowerCase()
          .includes(search) ||
        employee.email
          ?.toLowerCase()
          .includes(search) ||
        employee.department
          ?.toLowerCase()
          .includes(search) ||
        employee.designation
          ?.toLowerCase()
          .includes(search);

      const matchesDepartment =
        departmentFilter === "All" ||
        employee.department ===
          departmentFilter;

      return (
        matchesSearch &&
        matchesDepartment
      );
    });

  // ==========================================
  // DEPARTMENTS
  // ==========================================

  const departments = [
    ...new Set(
      employees
        .map(
          (employee) =>
            employee.department
        )
        .filter(Boolean)
    ),
  ].sort();

  // ==========================================
  // ATTENDANCE COUNTS
  // ==========================================

  const presentCount =
    employees.filter(
      (employee) =>
        todayAttendance[employee.id] ===
        "Present"
    ).length;

  const absentCount =
    employees.filter(
      (employee) =>
        todayAttendance[employee.id] ===
        "Absent"
    ).length;

  const leaveCount =
    employees.filter(
      (employee) =>
        todayAttendance[employee.id] ===
        "Leave"
    ).length;

  const notMarkedCount =
    employees.length -
    presentCount -
    absentCount -
    leaveCount;

  // ==========================================
  // CLOSE TOAST
  // ==========================================

  const handleCloseToast = () => {
    setToast({
      message: "",
      type: "success",
    });
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="attendance-layout">

      <Sidebar />

      <div className="attendance-main">

        <Header />

      <main className="attendance-content">

        {/* HEADER */}

        <header className="attendance-header">

          <div>
            <span className="attendance-label">
              HR MANAGEMENT
            </span>

            <h1>
              Attendance
            </h1>

            <p>
              Track and manage daily employee attendance.
            </p>
          </div>

        </header>

        {/* SUMMARY */}

        <section className="attendance-summary">

          <div className="attendance-summary-card present-card">
            <span>
              Present
            </span>

            <strong>
              {presentCount}
            </strong>

            <small>
              Employees marked present
            </small>
          </div>

          <div className="attendance-summary-card absent-card">
            <span>
              Absent
            </span>

            <strong>
              {absentCount}
            </strong>

            <small>
              Employees marked absent
            </small>
          </div>

          <div className="attendance-summary-card leave-card">
            <span>
              On Leave
            </span>

            <strong>
              {leaveCount}
            </strong>

            <small>
              Employees on leave
            </small>
          </div>

          <div className="attendance-summary-card pending-card">
            <span>
              Not Marked
            </span>

            <strong>
              {notMarkedCount}
            </strong>

            <small>
              Attendance pending
            </small>
          </div>

        </section>

        {/* ATTENDANCE SECTION */}

        <section className="attendance-section">

          <div className="attendance-section-header">

            <div>
              <h2>
                Daily Attendance
              </h2>

              <p>
                Mark attendance for employees.
              </p>
            </div>

            <div className="attendance-date-box">

              <label htmlFor="attendance-date">
                Select Date
              </label>

              <input
                id="attendance-date"
                type="date"
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

          {/* FILTER BAR */}

          <div className="attendance-filter-bar">

            <input
              type="text"
              className="attendance-search"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

            <select
              value={departmentFilter}
              onChange={(e) =>
                setDepartmentFilter(
                  e.target.value
                )
              }
              className="attendance-department-filter"
            >

              <option value="All">
                All Departments
              </option>

              {departments.map(
                (department) => (
                  <option
                    key={department}
                    value={department}
                  >
                    {department}
                  </option>
                )
              )}

            </select>

          </div>

          {/* EMPTY STATE */}

          {employees.length === 0 ? (

            <div className="attendance-empty">

              <h3>
                No Employees Found
              </h3>

              <p>
                Add employees first to start
                marking attendance.
              </p>

            </div>

          ) : filteredEmployees.length === 0 ? (

            <div className="attendance-empty">

              <h3>
                No Matching Employees
              </h3>

              <p>
                Try changing your search
                or department filter.
              </p>

            </div>

          ) : (

            /* EMPLOYEE ATTENDANCE LIST */

            <div className="attendance-list">

              {filteredEmployees.map(
                (employee) => {

                  const employeeStatus =
                    todayAttendance[
                      employee.id
                    ] || "";

                  return (
                    <div
                      className="attendance-row"
                      key={employee.id}
                    >

                      {/* EMPLOYEE */}

                      <div className="attendance-employee">

                        <div className="attendance-avatar">
                          {employee.name
                            ? employee.name
                                .charAt(0)
                                .toUpperCase()
                            : "E"}
                        </div>

                        <div>

                          <h3>
                            {employee.name}
                          </h3>

                          <p>
                            {employee.designation}
                          </p>

                        </div>

                      </div>

                      {/* DEPARTMENT */}

                      <div className="attendance-department">

                        <span>
                          Department
                        </span>

                        <strong>
                          {employee.department ||
                            "—"}
                        </strong>

                      </div>

                      {/* STATUS */}

                      <div className="attendance-current-status">

                        <span>
                          Status
                        </span>

                        <strong
                          className={
                            employeeStatus
                              ? `status-${employeeStatus.toLowerCase()}`
                              : "status-not-marked"
                          }
                        >
                          {employeeStatus ||
                            "Not Marked"}
                        </strong>

                      </div>

                      {/* ACTIONS */}

                      <div className="attendance-actions">

                        <button
                          type="button"
                          className={
                            employeeStatus ===
                            "Present"
                              ? "attendance-button present active"
                              : "attendance-button present"
                          }
                          onClick={() =>
                            markAttendance(
                              employee.id,
                              "Present"
                            )
                          }
                        >
                          Present
                        </button>

                        <button
                          type="button"
                          className={
                            employeeStatus ===
                            "Absent"
                              ? "attendance-button absent active"
                              : "attendance-button absent"
                          }
                          onClick={() =>
                            markAttendance(
                              employee.id,
                              "Absent"
                            )
                          }
                        >
                          Absent
                        </button>

                        <button
                          type="button"
                          className={
                            employeeStatus ===
                            "Leave"
                              ? "attendance-button leave active"
                              : "attendance-button leave"
                          }
                          onClick={() =>
                            markAttendance(
                              employee.id,
                              "Leave"
                            )
                          }
                        >
                          Leave
                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>

      </main>

      </div>

      {/* TOAST */}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={handleCloseToast}
      />

    </div>
  );
} 
