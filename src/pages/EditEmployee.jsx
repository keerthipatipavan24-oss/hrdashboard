import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";

import "./EditEmployee.css";

export default function EditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    joiningDate: "",
    employmentType: "Full Time",
  });

  const [errors, setErrors] = useState({});

  // LOAD EMPLOYEE DATA
  useEffect(() => {
    const employees =
      JSON.parse(localStorage.getItem("employees")) || [];

    const employee = employees.find(
      (item) => String(item.id) === String(id)
    );

    if (employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        department: employee.department || "",
        designation: employee.designation || "",
        joiningDate: employee.joiningDate || "",
        employmentType:
          employee.employmentType || "Full Time",
      });
    } else {
      navigate("/employees");
    }
  }, [id, navigate]);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // VALIDATION
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Employee name is required.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name =
        "Employee name must be at least 3 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone =
        "Phone number must be exactly 10 digits.";
    }

    if (!formData.department) {
      newErrors.department =
        "Please select a department.";
    }

    if (!formData.designation.trim()) {
      newErrors.designation =
        "Designation is required.";
    }

    if (!formData.joiningDate) {
      newErrors.joiningDate =
        "Joining date is required.";
    }

    if (!formData.employmentType) {
      newErrors.employmentType =
        "Please select employment type.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // UPDATE EMPLOYEE
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const employees =
      JSON.parse(localStorage.getItem("employees")) || [];

    const updatedEmployees = employees.map((employee) => {
      if (String(employee.id) === String(id)) {
        return {
          ...employee,
          ...formData,
        };
      }

      return employee;
    });

    // SAVE UPDATED EMPLOYEES
    localStorage.setItem(
      "employees",
      JSON.stringify(updatedEmployees)
    );

    // SAVE SUCCESS MESSAGE
    localStorage.setItem(
      "employeeMessage",
      "Employee updated successfully"
    );

    // GO BACK TO EMPLOYEES
    navigate("/employees");
  };

  return (
    <div className="employees-layout">

      <Sidebar />

      <div className="employees-main">

        <Header pageName="Employees" />

        <main className="edit-employee-content">

          <div className="edit-employee-page">

            <div className="edit-employee-container">

              {/* BACK BUTTON */}

              <button
                type="button"
                className="edit-back-button"
                onClick={() =>
                  navigate("/employees")
                }
              >
                ← Back to Employees
              </button>


              {/* HEADER */}

              <div className="edit-employee-header">

                <h1>
                  Edit Employee
                </h1>

                <p>
                  Update employee information and save
                  the changes.
                </p>

              </div>


              {/* FORM */}

              <form
                className="edit-employee-form"
                onSubmit={handleSubmit}
              >

                {/* NAME */}

                <div className="edit-form-group">

                  <label>
                    Employee Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter employee name"
                    className={
                      errors.name
                        ? "edit-input-error"
                        : ""
                    }
                  />

                  {errors.name && (
                    <p className="edit-field-error">
                      {errors.name}
                    </p>
                  )}

                </div>


                {/* EMAIL */}

                <div className="edit-form-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className={
                      errors.email
                        ? "edit-input-error"
                        : ""
                    }
                  />

                  {errors.email && (
                    <p className="edit-field-error">
                      {errors.email}
                    </p>
                  )}

                </div>


                {/* PHONE */}

                <div className="edit-form-group">

                  <label>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter 10-digit phone number"
                    maxLength="10"
                    className={
                      errors.phone
                        ? "edit-input-error"
                        : ""
                    }
                  />

                  {errors.phone && (
                    <p className="edit-field-error">
                      {errors.phone}
                    </p>
                  )}

                </div>


                {/* DEPARTMENT */}

                <div className="edit-form-group">

                  <label>
                    Department
                  </label>

                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={
                      errors.department
                        ? "edit-input-error"
                        : ""
                    }
                  >

                    <option value="">
                      Select Department
                    </option>

                    <option value="HR">
                      HR
                    </option>

                    <option value="IT">
                      IT
                    </option>

                    <option value="Finance">
                      Finance
                    </option>

                    <option value="Marketing">
                      Marketing
                    </option>

                    <option value="Sales">
                      Sales
                    </option>

                  </select>

                  {errors.department && (
                    <p className="edit-field-error">
                      {errors.department}
                    </p>
                  )}

                </div>


                {/* DESIGNATION */}

                <div className="edit-form-group">

                  <label>
                    Designation
                  </label>

                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Enter designation"
                    className={
                      errors.designation
                        ? "edit-input-error"
                        : ""
                    }
                  />

                  {errors.designation && (
                    <p className="edit-field-error">
                      {errors.designation}
                    </p>
                  )}

                </div>


                {/* JOINING DATE */}

                <div className="edit-form-group">

                  <label>
                    Joining Date
                  </label>

                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    className={
                      errors.joiningDate
                        ? "edit-input-error"
                        : ""
                    }
                  />

                  {errors.joiningDate && (
                    <p className="edit-field-error">
                      {errors.joiningDate}
                    </p>
                  )}

                </div>


                {/* EMPLOYMENT TYPE */}

                <div className="edit-form-group">

                  <label>
                    Employment Type
                  </label>

                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className={
                      errors.employmentType
                        ? "edit-input-error"
                        : ""
                    }
                  >

                    <option value="Full Time">
                      Full Time
                    </option>

                    <option value="Part Time">
                      Part Time
                    </option>

                    <option value="Contract">
                      Contract
                    </option>

                    <option value="Intern">
                      Intern
                    </option>

                  </select>

                  {errors.employmentType && (
                    <p className="edit-field-error">
                      {errors.employmentType}
                    </p>
                  )}

                </div>


                {/* BUTTONS */}

                <div className="edit-form-actions">

                  <button
                    type="button"
                    className="edit-cancel-button"
                    onClick={() =>
                      navigate("/employees")
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="edit-update-button"
                  >
                    Update Employee
                  </button>

                </div>

              </form>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
} 