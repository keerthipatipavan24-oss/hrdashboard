import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "./Header"; 

import "./Leave.css";

export default function Leave() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [leaveDecisions, setLeaveDecisions] = useState({});

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // LOAD DATA
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      const savedEmployees =
        JSON.parse(localStorage.getItem("employees")) || [];

      const savedAttendance =
        JSON.parse(localStorage.getItem("attendance")) || {};

      const savedLeaveDecisions =
        JSON.parse(localStorage.getItem("leaveDecisions")) || {};

      setEmployees(savedEmployees);
      setAttendance(savedAttendance);
      setLeaveDecisions(savedLeaveDecisions);

      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // GET ALL LEAVE REQUESTS FROM ATTENDANCE
  const leaveRequests = [];

  Object.keys(attendance).forEach((date) => {
    const dailyAttendance = attendance[date];

    Object.keys(dailyAttendance).forEach((employeeId) => {
      if (dailyAttendance[employeeId] === "Leave") {
        const employee = employees.find(
          (item) => String(item.id) === String(employeeId)
        );

        if (employee) {
          const requestId = `${date}_${employeeId}`;

          leaveRequests.push({
            id: requestId,
            employeeId: employee.id,
            employeeName: employee.name,
            email: employee.email,
            department: employee.department,
            designation: employee.designation,
            date: date,
            status: leaveDecisions[requestId] || "Pending",
          });
        }
      }
    });
  });

  // APPROVE / REJECT LEAVE
  const handleLeaveDecision = (requestId, decision) => {
    const updatedDecisions = {
      ...leaveDecisions,
      [requestId]: decision,
    };

    setLeaveDecisions(updatedDecisions);

    localStorage.setItem(
      "leaveDecisions",
      JSON.stringify(updatedDecisions)
    );
  };

  // FILTER REQUESTS
  const filteredRequests = leaveRequests.filter((request) => {
    const searchValue = searchTerm.toLowerCase();

    const matchesSearch =
      request.employeeName
        ?.toLowerCase()
        .includes(searchValue) ||
      request.department
        ?.toLowerCase()
        .includes(searchValue) ||
      request.designation
        ?.toLowerCase()
        .includes(searchValue);

    const matchesStatus =
      statusFilter === "All" ||
      request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // COUNTS
  const totalLeaves = leaveRequests.length;

  const pendingLeaves = leaveRequests.filter(
    (request) => request.status === "Pending"
  ).length;

  const approvedLeaves = leaveRequests.filter(
    (request) => request.status === "Approved"
  ).length;

  const rejectedLeaves = leaveRequests.filter(
    (request) => request.status === "Rejected"
  ).length;

  return (
    <div className="leave-layout">

      <Sidebar />

      <div className="leave-main">

        <Header /> 

      <main className="leave-content">

        {/* HEADER */}
        <header className="leave-header">
            <div>
  <span className="leave-label">
    HR MANAGEMENT
  </span>
</div> 
          <h1>Leave Management</h1>

          <p>
            Review and manage employee leave requests.
          </p>
        </header>


        {/* SUMMARY */}
        <section className="leave-summary">

          <div className="leave-summary-card">
            <span>Total Leaves</span>

            <strong>
              {totalLeaves}
            </strong>
          </div>


          <div className="leave-summary-card pending-card">
            <span>Pending</span>

            <strong>
              {pendingLeaves}
            </strong>
          </div>


          <div className="leave-summary-card approved-card">
            <span>Approved</span>

            <strong>
              {approvedLeaves}
            </strong>
          </div>


          <div className="leave-summary-card rejected-card">
            <span>Rejected</span>

            <strong>
              {rejectedLeaves}
            </strong>
          </div>

        </section>


        {/* LEAVE REQUEST SECTION */}
        <section className="leave-section">

          <div className="leave-section-header">

            <div>
              <h2>Leave Requests</h2>

              <p>
                Employees marked as Leave in Attendance
                appear here.
              </p>
            </div>

          </div>


          {/* FILTERS */}
          <div className="leave-filters">

            <div className="leave-search">

              <input
                type="text"
                placeholder="Search employee or department..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            </div>


            <div className="leave-status-filter">

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >

                <option value="All">
                  All Status
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Approved">
                  Approved
                </option>

                <option value="Rejected">
                  Rejected
                </option>

              </select>

            </div>

          </div>


          {/* LOADING STATE */}
          {loading ? (

            <div className="leave-loading-state">

              <div className="leave-loading-spinner"></div>

              <h3>
                Loading Leave Requests...
              </h3>

              <p>
                Please wait while leave records
                are loaded.
              </p>

            </div>

          ) : filteredRequests.length === 0 ? (

            /* EMPTY STATE */
            <div className="leave-empty-state">

              <h3>
                No Leave Requests Found
              </h3>

              <p>
                Employees marked as Leave in
                Attendance will appear here.
              </p>

            </div>

          ) : (

            /* LEAVE TABLE */
            <div className="leave-table-wrapper">

              <table className="leave-table">

                <thead>

                  <tr>

                    <th>
                      Employee
                    </th>

                    <th>
                      Department
                    </th>

                    <th>
                      Designation
                    </th>

                    <th>
                      Leave Date
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredRequests.map(
                    (request) => (

                      <tr
                        key={request.id}
                      >

                        {/* EMPLOYEE */}
                        <td>

                          <div className="leave-employee">

                            <div className="leave-avatar">

                              {request.employeeName
                                ? request.employeeName
                                    .charAt(0)
                                    .toUpperCase()
                                : "E"}

                            </div>


                            <div className="leave-employee-info">

                              <strong>
                                {request.employeeName}
                              </strong>

                              <span>
                                {request.email}
                              </span>

                            </div>

                          </div>

                        </td>


                        {/* DEPARTMENT */}
                        <td>
                          {request.department}
                        </td>


                        {/* DESIGNATION */}
                        <td>
                          {request.designation}
                        </td>


                        {/* DATE */}
                        <td>

                          {new Date(
                            request.date + "T00:00:00"
                          ).toLocaleDateString(
                            "en-IN"
                          )}

                        </td>


                        {/* STATUS */}
                        <td>

                          <span
                            className={`leave-status ${request.status.toLowerCase()}`}
                          >
                            {request.status}
                          </span>

                        </td>


                        {/* ACTION */}
                        <td>

                          {request.status ===
                          "Pending" ? (

                            <div className="leave-actions">

                              <button
                                className="approve-button"
                                onClick={() =>
                                  handleLeaveDecision(
                                    request.id,
                                    "Approved"
                                  )
                                }
                              >
                                Approve
                              </button>


                              <button
                                className="reject-button"
                                onClick={() =>
                                  handleLeaveDecision(
                                    request.id,
                                    "Rejected"
                                  )
                                }
                              >
                                Reject
                              </button>

                            </div>

                          ) : (

                            <div className="leave-completed-actions">

                              <span className="leave-action-completed">
                                Completed
                              </span>


                              <button
                                className="leave-edit-button"
                                onClick={() =>
                                  handleLeaveDecision(
                                    request.id,
                                    "Pending"
                                  )
                                }
                              >
                                Edit
                              </button>

                            </div>

                          )}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

      </div>

    </div>
  );
} 