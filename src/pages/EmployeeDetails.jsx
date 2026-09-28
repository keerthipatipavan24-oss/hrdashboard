import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "./Header";

import "./EmployeeDetails.css";

export default function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);

  // ==========================================
  // LOAD EMPLOYEE
  // ==========================================

  useEffect(() => {
    const employees =
      JSON.parse(localStorage.getItem("employees")) || [];

    const foundEmployee = employees.find(
      (employee) =>
        String(employee.id) === String(id)
    );

    setEmployee(foundEmployee);
  }, [id]);

  // ==========================================
  // EMPLOYEE NOT FOUND
  // ==========================================

  if (!employee) {
    return (
      <div className="employee-details-layout">

        <Sidebar />

        <main className="employee-details-content">

          <Header pageName="Employees" />

          <h1>
            Employee Not Found
          </h1>

          <p>
            The employee record could not be found.
          </p>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/employees")}
          >
            ← Back to Employees
          </button>

        </main>

      </div>
    );
  }

  // ==========================================
  // EMPLOYEE DETAILS
  // ==========================================

  return (
    <div className="employee-details-layout">

      <Sidebar />

      <main className="employee-details-content">

        <Header />

        {/* PAGE HEADER */}

        <header className="employee-details-header">

          <h1>
            Employee Details
          </h1>

          <p>
            View complete employee information.
          </p>

        </header>


        {/* EMPLOYEE CARD */}

        <section className="employee-details-card">

          {/* TOP SECTION */}

          <div className="employee-details-top">

            <div className="employee-details-avatar">
              {employee.name
                ? employee.name
                    .charAt(0)
                    .toUpperCase()
                : "E"}
            </div>

            <div>

              <h2>
                {employee.name}
              </h2>

              <p>
                {employee.designation}
              </p>

            </div>

            <span className="employee-details-status">
              Active
            </span>

          </div>


          {/* DIVIDER */}

          <div className="employee-details-divider"></div>


          {/* EMPLOYEE INFORMATION */}

          <div className="employee-details-grid">

            <div className="employee-detail">

              <span>
                Employee ID
              </span>

              <strong>
                {employee.id}
              </strong>

            </div>


            <div className="employee-detail">

              <span>
                Email
              </span>

              <strong>
                {employee.email}
              </strong>

            </div>


            <div className="employee-detail">

              <span>
                Phone Number
              </span>

              <strong>
                {employee.phone}
              </strong>

            </div>


            <div className="employee-detail">

              <span>
                Department
              </span>

              <strong>
                {employee.department}
              </strong>

            </div>


            <div className="employee-detail">

              <span>
                Designation
              </span>

              <strong>
                {employee.designation}
              </strong>

            </div>


            <div className="employee-detail">

              <span>
                Joining Date
              </span>

              <strong>
                {employee.joiningDate}
              </strong>

            </div>


            <div className="employee-detail">

              <span>
                Employment Type
              </span>

              <strong>
                {employee.employmentType}
              </strong>

            </div>

          </div>


          {/* DIVIDER */}

          <div className="employee-details-divider"></div>


          {/* ACTIONS */}

          <div className="employee-details-actions">

            <button
              type="button"
              className="back-details-button"
              onClick={() =>
                navigate("/employees")
              }
            >
              Back to Employees
            </button>

          </div>

        </section>

      </main>

    </div>
  );
} 