import EmployeeForm from "../components/EmployeeForm";
import Sidebar from "../components/Sidebar";

import "./AddEmployee.css";

export default function AddEmployee() {
  return (
    <div className="add-employee-layout">

      <Sidebar />

      <main className="add-employee-content">

        <div className="add-employee-container">

          <header className="add-employee-page-header">
            <h1>Add Employee</h1>

            <p>
              Create a new employee record.
            </p>
          </header>

          <section className="add-employee-section">

            <div className="add-employee-header">
              <h2>Employee Details</h2>

              <p>
                Enter the employee information below.
              </p>
            </div>

            <EmployeeForm />

          </section>

        </div>

      </main>

    </div>
  );
} 