import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "./Header";

import "./Dashboard.css";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [leaveDecisions, setLeaveDecisions] = useState({});

  /* =========================================================
     LOAD EMPLOYEES
  ========================================================= */

  const loadEmployees = () => {
    try {
      const savedEmployees = localStorage.getItem("employees");

      if (savedEmployees) {
        const parsedEmployees = JSON.parse(savedEmployees);

        setEmployees(
          Array.isArray(parsedEmployees)
            ? parsedEmployees
            : []
        );
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error("Error loading employees:", error);
      setEmployees([]);
    }
  };

  /* =========================================================
     LOAD DASHBOARD DATA
  ========================================================= */

  const loadDashboardData = () => {
    loadEmployees();

    try {
      const savedAttendance =
        localStorage.getItem("attendance");

      const savedLeaveDecisions =
        localStorage.getItem("leaveDecisions");

      setAttendance(
        savedAttendance
          ? JSON.parse(savedAttendance)
          : {}
      );

      setLeaveDecisions(
        savedLeaveDecisions
          ? JSON.parse(savedLeaveDecisions)
          : {}
      );
    } catch (error) {
      console.error(
        "Error loading dashboard data:",
        error
      );

      setAttendance({});
      setLeaveDecisions({});
    }
  };

  /* =========================================================
     USE EFFECT
  ========================================================= */

  useEffect(() => {
    loadDashboardData();

    const handleEmployeesUpdated = () => {
      loadDashboardData();
    };

    const handleStorageChange = (event) => {
      if (
        event.key === "employees" ||
        event.key === "attendance" ||
        event.key === "leaveDecisions"
      ) {
        loadDashboardData();
      }
    };

    window.addEventListener(
      "employeesUpdated",
      handleEmployeesUpdated
    );

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "employeesUpdated",
        handleEmployeesUpdated
      );

      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  /* =========================================================
     DASHBOARD CALCULATIONS
  ========================================================= */

  const totalEmployees = employees.length;

  const departmentList = [
    ...new Set(
      employees
        .map((employee) => employee.department)
        .filter(Boolean)
    ),
  ];

  const totalDepartments = departmentList.length;

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const todayAttendance = attendance[today] || {};

  const presentToday = employees.filter(
    (employee) =>
      todayAttendance[employee.id] === "Present"
  ).length;

  const absentToday = employees.filter(
    (employee) =>
      todayAttendance[employee.id] === "Absent"
  ).length;

  const leaveToday = employees.filter(
    (employee) =>
      todayAttendance[employee.id] === "Leave"
  ).length;

  /* =========================================================
     LEAVE REQUESTS
  ========================================================= */

  const leaveRequests = [];

  Object.keys(attendance).forEach((date) => {
    const dailyAttendance = attendance[date] || {};

    Object.keys(dailyAttendance).forEach(
      (employeeId) => {
        if (
          dailyAttendance[employeeId] === "Leave"
        ) {
          const employee = employees.find(
            (item) =>
              String(item.id) ===
              String(employeeId)
          );

          if (employee) {
            const requestId =
              `${date}_${employeeId}`;

            leaveRequests.push({
              id: requestId,
              employeeId: employee.id,
              employeeName: employee.name,
              date,
              status:
                leaveDecisions[requestId] ||
                "Pending",
            });
          }
        }
      }
    );
  });

  const pendingLeaves =
    leaveRequests.filter(
      (request) =>
        request.status === "Pending"
    ).length;

  /* =========================================================
     RECENT EMPLOYEES
  ========================================================= */

  const recentEmployees = [...employees]
    .slice(-5)
    .reverse();

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="dashboard-main">

        {/* APPLICATION HEADER */}
        <Header pageName="Dashboard"/>

        {/* DASHBOARD CONTENT */}
        <main className="dashboard-content">

          {/* DASHBOARD HEADER */}
          <header className="dashboard-header">

            <span className="dashboard-label">
              HR MANAGEMENT
            </span>

            <h1>HR Dashboard</h1>

            <p>
              A clear overview of your workforce and
              daily HR activity.
            </p>

          </header>

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <section className="stats-grid">

            {/* TOTAL EMPLOYEES */}
            <div className="stat-card">

              <div className="stat-card-label">
                Total Employees
              </div>

              <div className="stat-card-number">
                {totalEmployees}
              </div>

              <div className="stat-card-note">
                Active employee records
              </div>

            </div>

            {/* DEPARTMENTS */}
            <div className="stat-card">

              <div className="stat-card-label">
                Departments
              </div>

              <div className="stat-card-number">
                {totalDepartments}
              </div>

              <div className="stat-card-note">
                Across the organization
              </div>

            </div>

            {/* PRESENT TODAY */}
            <div className="stat-card">

              <div className="stat-card-label">
                Present Today
              </div>

              <div className="stat-card-number">
                {presentToday}
              </div>

              <div className="stat-card-note">
                Employees marked present
              </div>

            </div>

            {/* PENDING LEAVES */}
            <div className="stat-card">

              <div className="stat-card-label">
                Pending Leaves
              </div>

              <div className="stat-card-number">
                {pendingLeaves}
              </div>

              <div className="stat-card-note">
                Requests awaiting review
              </div>

            </div>

          </section>

          {/* =================================================
              LOWER DASHBOARD
          ================================================= */}

          <section className="dashboard-lower-grid">

            {/* =================================================
                RECENT EMPLOYEES
            ================================================= */}

            <div className="dashboard-panel">

              <div className="panel-header">

                <div>
                  <h2>Recent Employees</h2>

                  <p>
                    Latest employee records
                  </p>
                </div>

              </div>

              {recentEmployees.length === 0 ? (

                <div className="dashboard-empty">

                  <h3>No Employees Yet</h3>

                  <p>
                    Add employees to see them here.
                  </p>

                </div>

              ) : (

                <div className="recent-employee-list">

                  {recentEmployees.map(
                    (employee) => (

                      <div
                        className="recent-employee"
                        key={employee.id}
                      >

                        <div className="recent-avatar">
                          {employee.name
                            ? employee.name
                                .charAt(0)
                                .toUpperCase()
                            : "E"}
                        </div>

                        <div className="recent-info">

                          <h3>
                            {employee.name}
                          </h3>

                          <p>
                            {employee.designation ||
                              "Employee"}
                          </p>

                        </div>

                        <span className="employee-department">
                          {employee.department ||
                            "General"}
                        </span>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

            {/* =================================================
                TODAY'S ATTENDANCE
            ================================================= */}

            <div className="dashboard-panel">

              <div className="panel-header">

                <div>
                  <h2>
                    Today's Attendance
                  </h2>

                  <p>
                    Current attendance overview
                  </p>
                </div>

              </div>

              <div className="attendance-overview">

                {/* PRESENT */}
                <div className="attendance-item">

                  <div className="attendance-item-left">

                    <span className="attendance-dot present" />

                    <span>
                      Present
                    </span>

                  </div>

                  <strong>
                    {presentToday}
                  </strong>

                </div>

                {/* ABSENT */}
                <div className="attendance-item">

                  <div className="attendance-item-left">

                    <span className="attendance-dot absent" />

                    <span>
                      Absent
                    </span>

                  </div>

                  <strong>
                    {absentToday}
                  </strong>

                </div>

                {/* ON LEAVE */}
                <div className="attendance-item">

                  <div className="attendance-item-left">

                    <span className="attendance-dot leave" />

                    <span>
                      On Leave
                    </span>

                  </div>

                  <strong>
                    {leaveToday}
                  </strong>

                </div>

              </div>

              {/* TOTAL */}
              <div className="attendance-total">

                <span>
                  Total Employees
                </span>

                <strong>
                  {totalEmployees}
                </strong>

              </div>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
} 