import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "./Header";

import "./Performance.css";

export default function Performance() {
  const [employees, setEmployees] = useState([]);
  const [performanceData, setPerformanceData] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All Ratings");

  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [rating, setRating] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  // LOAD DATA
  useEffect(() => {
    const savedEmployees = JSON.parse(localStorage.getItem("employees")) || [];

    const savedPerformance =
      JSON.parse(localStorage.getItem("performanceData")) || {};

    setEmployees(savedEmployees);
    setPerformanceData(savedPerformance);
  }, []);

  // OPEN RATE / EDIT MODAL
  const handleRate = (employee) => {
    setSelectedEmployee(employee);

    const existingPerformance = performanceData[employee.id];

    if (existingPerformance) {
      setRating(existingPerformance.rating || "");
      setFeedback(existingPerformance.feedback || "");
    } else {
      setRating("");
      setFeedback("");
    }

    // Clear old validation message
    setError("");

    setShowModal(true);
  };

  // CLOSE MODAL
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
    setRating("");
    setFeedback("");
    setError("");
  };

  // SAVE PERFORMANCE
  const handleSavePerformance = () => {
    // Validation happens only when Save is clicked
    if (!rating) {
      setError("Performance rating is required.");
      return;
    }

    const updatedPerformance = {
      ...performanceData,
      [selectedEmployee.id]: {
        rating: rating,
        feedback: feedback.trim(),
      },
    };

    setPerformanceData(updatedPerformance);

    localStorage.setItem("performanceData", JSON.stringify(updatedPerformance));

    handleCloseModal();
  };

  // FILTER EMPLOYEES
  const filteredEmployees = employees.filter((employee) => {
    const searchValue = searchTerm.toLowerCase();

    const matchesSearch =
      employee.name?.toLowerCase().includes(searchValue) ||
      employee.department?.toLowerCase().includes(searchValue) ||
      employee.designation?.toLowerCase().includes(searchValue);

    const employeeRating = performanceData[employee.id]?.rating || "Not Rated";

    const matchesRating =
      ratingFilter === "All Ratings" || employeeRating === ratingFilter;

    return matchesSearch && matchesRating;
  });

  // SUMMARY COUNTS
  const totalEmployees = employees.length;

  const ratedEmployees = employees.filter(
    (employee) => performanceData[employee.id],
  ).length;

  const notRatedEmployees = totalEmployees - ratedEmployees;

  const excellentEmployees = employees.filter(
    (employee) => performanceData[employee.id]?.rating === "Excellent",
  ).length;

  const goodEmployees = employees.filter(
    (employee) => performanceData[employee.id]?.rating === "Good",
  ).length;

  return (
    <div className="performance-layout">
      <Sidebar />

      <div className="performance-main">
        <Header pageName="Performance" />

        <main className="performance-content">
          {/* HEADER */}

          <header className="performance-header">
            <div>
              <span className="performance-label">HR MANAGEMENT</span>
            </div>
            <h1>Performance</h1>

            <p>Review and manage employee performance.</p>
          </header>

          {/* SUMMARY CARDS */}

          <section className="performance-summary">
            <div className="performance-summary-card">
              <span>Total Employees</span>
              <strong>{totalEmployees}</strong>
            </div>

            <div className="performance-summary-card">
              <span>Rated</span>
              <strong>{ratedEmployees}</strong>
            </div>

            <div className="performance-summary-card">
              <span>Not Rated</span>
              <strong>{notRatedEmployees}</strong>
            </div>

            <div className="performance-summary-card">
              <span>Excellent</span>
              <strong className="excellent-count">{excellentEmployees}</strong>
            </div>

            <div className="performance-summary-card">
              <span>Good</span>
              <strong className="good-count">{goodEmployees}</strong>
            </div>
          </section>

          {/* PERFORMANCE SECTION */}

          <section className="performance-section">
            <div className="performance-section-header">
              <div>
                <h2>Employee Performance</h2>

                <p>Review employee performance and provide feedback.</p>
              </div>
            </div>

            {/* FILTERS */}

            <div className="performance-filters">
              <div className="performance-search">
                <input
                  type="text"
                  placeholder="Search employee or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="performance-rating-filter">
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                >
                  <option value="All Ratings">All Ratings</option>

                  <option value="Excellent">Excellent</option>

                  <option value="Good">Good</option>

                  <option value="Average">Average</option>

                  <option value="Needs Improvement">Needs Improvement</option>

                  <option value="Not Rated">Not Rated</option>
                </select>
              </div>
            </div>

            {/* EMPTY STATE */}

            {filteredEmployees.length === 0 ? (
              <div className="performance-empty-state">
                <h3>No Employees Found</h3>

                <p>No employees match your search or rating filter.</p>
              </div>
            ) : (
              /* TABLE */

              <div className="performance-table-wrapper">
                <table className="performance-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Rating</th>
                      <th>Feedback</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEmployees.map((employee) => {
                      const employeePerformance = performanceData[employee.id];

                      const employeeRating =
                        employeePerformance?.rating || "Not Rated";

                      const employeeFeedback =
                        employeePerformance?.feedback || "";

                      return (
                        <tr key={employee.id}>
                          {/* EMPLOYEE */}

                          <td>
                            <div className="performance-employee">
                              <div className="performance-avatar">
                                {employee.name
                                  ? employee.name.charAt(0).toUpperCase()
                                  : "E"}
                              </div>

                              <div>
                                <strong>{employee.name}</strong>

                                <span>{employee.email}</span>
                              </div>
                            </div>
                          </td>

                          {/* DEPARTMENT */}

                          <td>{employee.department || "-"}</td>

                          {/* DESIGNATION */}

                          <td>{employee.designation || "-"}</td>

                          {/* RATING */}

                          <td>
                            <span
                              className={`performance-rating ${employeeRating
                                .toLowerCase()
                                .replaceAll(" ", "-")}`}
                            >
                              {employeeRating}
                            </span>
                          </td>

                          {/* FEEDBACK */}

                          <td>
                            {employeeFeedback ? (
                              <span className="performance-feedback">
                                {employeeFeedback}
                              </span>
                            ) : (
                              <span className="no-feedback">No feedback</span>
                            )}
                          </td>

                          {/* ACTION */}

                          <td>
                            <button
                              className="performance-rate-button"
                              onClick={() => handleRate(employee)}
                            >
                              {employeePerformance ? "Edit" : "Rate"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* PERFORMANCE MODAL */}

      {showModal && selectedEmployee && (
        <div className="performance-modal-overlay" onClick={handleCloseModal}>
          <div
            className="performance-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}

            <div className="performance-modal-header">
              <div>
                <h2>
                  {performanceData[selectedEmployee.id]
                    ? "Edit Performance"
                    : "Add Performance"}
                </h2>

                <p>{selectedEmployee.name}</p>
              </div>

              <button
                className="performance-close-button"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="performance-modal-body">
              {/* RATING */}

              <div className="performance-form-group">
                <label>Performance Rating</label>

                <select
                  value={rating}
                  onChange={(e) => {
                    setRating(e.target.value);
                    setError("");
                  }}
                >
                  <option value="">Select Rating</option>

                  <option value="Excellent">Excellent</option>

                  <option value="Good">Good</option>

                  <option value="Average">Average</option>

                  <option value="Needs Improvement">Needs Improvement</option>
                </select>

                {/* VALIDATION */}

                {error && <p className="performance-error">{error}</p>}
              </div>

              {/* FEEDBACK */}

              <div className="performance-form-group">
                <label>Feedback</label>

                <textarea
                  placeholder="Enter performance feedback..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows="4"
                />
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="performance-modal-footer">
              <button
                className="performance-cancel-button"
                onClick={handleCloseModal}
              >
                Cancel
              </button>

              <button
                className="performance-save-button"
                onClick={handleSavePerformance}
              >
                Save Performance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
