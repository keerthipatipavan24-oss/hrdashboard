import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "./Header";
import Toast from "./Toast";

import "./Employees.css";

// ==========================================
// DEFAULT DEMO EMPLOYEES
// ==========================================

const defaultEmployees = [
  {
    id: 1,
    name: "Rahul Kumar",
    email: "rahul.kumar@gmail.com",
    department: "IT",
    designation: "Frontend Developer",
    phone: "9876543210",
    joiningDate: "2025-06-10",
    employmentType: "Full Time",
  },
  {
    id: 2,
    name: "Sneha Reddy",
    email: "sneha.reddy@gmail.com",
    department: "HR",
    designation: "HR Executive",
    phone: "9876543211",
    joiningDate: "2025-07-15",
    employmentType: "Full Time",
  },
  {
    id: 3,
    name: "Arjun Sharma",
    email: "arjun.sharma@gmail.com",
    department: "Finance",
    designation: "Financial Analyst",
    phone: "9876543212",
    joiningDate: "2025-08-05",
    employmentType: "Full Time",
  },
  {
    id: 4,
    name: "Priya Nair",
    email: "priya.nair@gmail.com",
    department: "Marketing",
    designation: "Marketing Executive",
    phone: "9876543213",
    joiningDate: "2025-09-01",
    employmentType: "Full Time",
  },
  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram.singh@gmail.com",
    department: "IT",
    designation: "Backend Developer",
    phone: "9876543214",
    joiningDate: "2025-09-20",
    employmentType: "Full Time",
  },
  {
    id: 6,
    name: "Ananya Rao",
    email: "ananya.rao@gmail.com",
    department: "Operations",
    designation: "Operations Executive",
    phone: "9876543215",
    joiningDate: "2025-10-12",
    employmentType: "Full Time",
  },
];

// ==========================================
// EMPLOYEES COMPONENT
// ==========================================

export default function Employees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const employeesPerPage = 4;

  // ==========================================
  // LOAD EMPLOYEES
  // ==========================================

  const loadEmployees = () => {
    setLoading(true);

    try {
      const savedEmployees = localStorage.getItem("employees");

      if (savedEmployees) {
        const parsedEmployees = JSON.parse(savedEmployees);

        if (Array.isArray(parsedEmployees)) {
          setEmployees(parsedEmployees);
        } else {
          setEmployees(defaultEmployees);

          localStorage.setItem(
            "employees",
            JSON.stringify(defaultEmployees)
          );
        }
      } else {
        setEmployees(defaultEmployees);

        localStorage.setItem(
          "employees",
          JSON.stringify(defaultEmployees)
        );
      }
    } catch (error) {
      console.error("Error loading employees:", error);

      setEmployees(defaultEmployees);

      localStorage.setItem(
        "employees",
        JSON.stringify(defaultEmployees)
      );

      setToast({
        message: "Unable to load employees.",
        type: "error",
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
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
  // DELETE MODAL
  // ==========================================

  const openDeleteModal = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedEmployee(null);
  };

  // ==========================================
  // DELETE EMPLOYEE
  // ==========================================

  const handleDelete = () => {
    if (!selectedEmployee) {
      return;
    }

    const updatedEmployees = employees.filter(
      (employee) =>
        String(employee.id) !==
        String(selectedEmployee.id)
    );

    localStorage.setItem(
      "employees",
      JSON.stringify(updatedEmployees)
    );

    setEmployees(updatedEmployees);

    const newTotalPages = Math.ceil(
      updatedEmployees.length / employeesPerPage
    );

    if (
      newTotalPages > 0 &&
      currentPage > newTotalPages
    ) {
      setCurrentPage(newTotalPages);
    }

    closeDeleteModal();

    setToast({
      message: "Employee deleted successfully",
      type: "success",
    });

    window.dispatchEvent(
      new Event("employeesUpdated")
    );
  };

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredEmployees = employees.filter(
    (employee) => {
      const search = searchTerm.toLowerCase().trim();

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
          .includes(search) ||
        employee.phone
          ?.toLowerCase()
          .includes(search);

      const matchesDepartment =
        departmentFilter === "All" ||
        employee.department === departmentFilter;

      return (
        matchesSearch &&
        matchesDepartment
      );
    }
  );

  // ==========================================
  // SORT
  // ==========================================

  const sortedEmployees = [...filteredEmployees].sort(
    (a, b) => {
      if (sortOption === "name-asc") {
        return (a.name || "").localeCompare(
          b.name || ""
        );
      }

      if (sortOption === "name-desc") {
        return (b.name || "").localeCompare(
          a.name || ""
        );
      }

      if (sortOption === "department-asc") {
        return (a.department || "").localeCompare(
          b.department || ""
        );
      }

      if (sortOption === "department-desc") {
        return (b.department || "").localeCompare(
          a.department || ""
        );
      }

      return 0;
    }
  );

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages = Math.ceil(
    sortedEmployees.length / employeesPerPage
  );

  const startIndex =
    (currentPage - 1) * employeesPerPage;

  const currentEmployees = sortedEmployees.slice(
    startIndex,
    startIndex + employeesPerPage
  );

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // ==========================================
  // DEPARTMENT FILTER
  // ==========================================

  const handleDepartmentChange = (e) => {
    setDepartmentFilter(e.target.value);
    setCurrentPage(1);
  };

  // ==========================================
  // SORT
  // ==========================================

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  // ==========================================
  // PAGE CHANGE
  // ==========================================

  const handlePageChange = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // TOAST
  // ==========================================

  const handleCloseToast = () => {
    setToast({
      message: "",
      type: "success",
    });
  };

  // ==========================================
  // DEPARTMENTS
  // ==========================================

  const departments = [
    ...new Set(
      employees
        .map((employee) => employee.department)
        .filter(Boolean)
    ),
  ].sort();

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="employees-layout">

      <Sidebar />

      <div className="employees-main">

        <Header />

        <main className="employees-content">

          {/* PAGE HEADER */}

          <div className="employees-header">

            <div>

              <span className="employees-label">
                HR MANAGEMENT
              </span>

              <h1>
                Employees
              </h1>

              <p>
                Manage employee information and records.
              </p>

            </div>

          </div>

          {/* EMPLOYEE SECTION */}

          <section className="employee-section">

            <div className="employee-section-title">

              <div>

                <h2>
                  Employee List
                </h2>

                <p>
                  View and manage all employees.
                </p>

              </div>

              <button
                type="button"
                className="add-employee-button"
                onClick={() =>
                  navigate("/add-employee")
                }
              >
                + Add Employee
              </button>

            </div>

            {/* FILTER BAR */}

            <div className="employee-filter-bar">

              <input
                type="text"
                className="employee-search-input"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={handleSearchChange}
              />

              <select
                className="employee-sort-select"
                value={departmentFilter}
                onChange={handleDepartmentChange}
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

              <select
                className="employee-sort-select"
                value={sortOption}
                onChange={handleSortChange}
              >

                <option value="default">
                  Sort Employees
                </option>

                <option value="name-asc">
                  Name: A → Z
                </option>

                <option value="name-desc">
                  Name: Z → A
                </option>

                <option value="department-asc">
                  Department: A → Z
                </option>

                <option value="department-desc">
                  Department: Z → A
                </option>

              </select>

            </div>

            {/* CONTENT */}

            {loading ? (

              <div className="employee-loading">

                <div className="employee-loading-spinner"></div>

                <p>
                  Loading Employees...
                </p>

              </div>

            ) : employees.length === 0 ? (

              <div className="empty-state">

                <h3>
                  No Employees Found
                </h3>

                <p>
                  Add your first employee
                  to start managing
                  employee records.
                </p>

              </div>

            ) : filteredEmployees.length === 0 ? (

              <div className="empty-state">

                <h3>
                  No Matching Employees
                </h3>

                <p>
                  Try changing your
                  search or department
                  filter.
                </p>

              </div>

            ) : (

              <>

                {/* EMPLOYEE GRID */}

                <div className="employee-grid">

                  {currentEmployees.map(
                    (employee) => (

                      <article
                        className="employee-card"
                        key={employee.id}
                      >

                        <div className="employee-card-top">

                          <div className="employee-avatar">
                            {employee.name
                              ? employee.name
                                  .charAt(0)
                                  .toUpperCase()
                              : "E"}
                          </div>

                          <div className="employee-main-info">

                            <h3>
                              {employee.name}
                            </h3>

                            <p>
                              {employee.designation}
                            </p>

                          </div>

                          <span className="status-badge">
                            Active
                          </span>

                        </div>

                        <div className="employee-divider" />

                        <div className="employee-details">

                          <div className="detail-item">
                            <span>
                              Department
                            </span>

                            <strong>
                              {employee.department}
                            </strong>
                          </div>

                          <div className="detail-item">
                            <span>
                              Email
                            </span>

                            <strong>
                              {employee.email}
                            </strong>
                          </div>

                          <div className="detail-item">
                            <span>
                              Phone
                            </span>

                            <strong>
                              {employee.phone}
                            </strong>
                          </div>

                          <div className="detail-item">
                            <span>
                              Joining Date
                            </span>

                            <strong>
                              {employee.joiningDate}
                            </strong>
                          </div>

                          <div className="detail-item">
                            <span>
                              Employment Type
                            </span>

                            <strong>
                              {employee.employmentType}
                            </strong>
                          </div>

                        </div>

                        <div className="employee-actions">

                          <button
                            type="button"
                            className="view-button"
                            onClick={() =>
                              navigate(
                                `/employee-details/${employee.id}`
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="edit-button"
                            onClick={() =>
                              navigate(
                                `/edit-employee/${employee.id}`
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              openDeleteModal(
                                employee
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </article>

                    )
                  )}

                </div>

                {/* PAGINATION */}

                {totalPages > 1 && (

                  <div className="employee-pagination">

                    <button
                      type="button"
                      className="pagination-button"
                      disabled={currentPage === 1}
                      onClick={() =>
                        handlePageChange(
                          currentPage - 1
                        )
                      }
                    >
                      ← Previous
                    </button>

                    <div className="pagination-pages">

                      {Array.from(
                        {
                          length: totalPages,
                        },
                        (_, index) =>
                          index + 1
                      ).map((page) => (

                        <button
                          type="button"
                          key={page}
                          className={
                            currentPage === page
                              ? "pagination-page active"
                              : "pagination-page"
                          }
                          onClick={() =>
                            handlePageChange(page)
                          }
                        >
                          {page}
                        </button>

                      ))}

                    </div>

                    <button
                      type="button"
                      className="pagination-button"
                      disabled={
                        currentPage === totalPages
                      }
                      onClick={() =>
                        handlePageChange(
                          currentPage + 1
                        )
                      }
                    >
                      Next →
                    </button>

                  </div>

                )}

              </>

            )}

          </section>

        </main>

      </div>

      {/* DELETE MODAL */}

      {showDeleteModal &&
        selectedEmployee && (

          <div
            className="delete-modal-overlay"
            onClick={closeDeleteModal}
          >

            <div
              className="delete-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="delete-modal-icon">
                ⚠️
              </div>

              <h2>
                Delete Employee?
              </h2>

              <p>
                Are you sure you want
                to delete{" "}
                <strong>
                  {selectedEmployee.name}
                </strong>
                ?
              </p>

              <p className="delete-modal-warning">
                This action cannot be
                undone.
              </p>

              <div className="delete-modal-actions">

                <button
                  type="button"
                  className="cancel-delete-button"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="confirm-delete-button"
                  onClick={handleDelete}
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        )}

      {/* TOAST */}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={handleCloseToast}
      />

    </div>
  );
} 