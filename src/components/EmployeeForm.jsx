import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./EmployeeForm.css";

export default function EmployeeForm() {
  const navigate = useNavigate();

  // ==========================================
  // DEFAULT DEPARTMENTS
  // ==========================================

  const defaultDepartments = [
    {
      id: 1,
      name: "HR",
    },
    {
      id: 2,
      name: "Design",
    },
    {
      id: 3,
      name: "Finance",
    },
    {
      id: 4,
      name: "Marketing",
    },
    {
      id: 5,
      name: "Engineering",
    },
  ];

  // ==========================================
  // STATES
  // ==========================================

  const [departments, setDepartments] = useState([]);

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

  // ==========================================
  // LOAD DEPARTMENTS
  // ==========================================

  useEffect(() => {
    try {
      const savedDepartments =
        localStorage.getItem("departments");

      if (savedDepartments) {
        const parsedDepartments =
          JSON.parse(savedDepartments);

        if (
          Array.isArray(parsedDepartments) &&
          parsedDepartments.length > 0
        ) {
          setDepartments(parsedDepartments);
        } else {
          localStorage.setItem(
            "departments",
            JSON.stringify(defaultDepartments)
          );

          setDepartments(defaultDepartments);
        }
      } else {
        localStorage.setItem(
          "departments",
          JSON.stringify(defaultDepartments)
        );

        setDepartments(defaultDepartments);
      }
    } catch (error) {
      console.error(
        "Error loading departments:",
        error
      );

      setDepartments(defaultDepartments);
    }
  }, []);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  // ==========================================
  // VALIDATE FORM
  // ==========================================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Employee name is required.";
    } else if (
      formData.name.trim().length < 3
    ) {
      newErrors.name =
        "Employee name must be at least 3 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    } else if (
      !/^[0-9]{10}$/.test(formData.phone)
    ) {
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
    } else if (
      formData.designation.trim().length < 2
    ) {
      newErrors.designation =
        "Designation must be at least 2 characters.";
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

  // ==========================================
  // SUBMIT FORM
  // ==========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const employees = JSON.parse(
      localStorage.getItem("employees") || "[]"
    );

    // ==========================================
    // DUPLICATE EMAIL
    // ==========================================

    const duplicateEmail = employees.some(
      (employee) =>
        employee.email?.toLowerCase() ===
        formData.email.trim().toLowerCase()
    );

    if (duplicateEmail) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        email:
          "This email is already registered.",
      }));

      return;
    }

    // ==========================================
    // DUPLICATE PHONE
    // ==========================================

    const duplicatePhone = employees.some(
      (employee) =>
        employee.phone ===
        formData.phone.trim()
    );

    if (duplicatePhone) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        phone:
          "This phone number is already registered.",
      }));

      return;
    }

    // ==========================================
    // CREATE EMPLOYEE
    // ==========================================

    const newEmployee = {
      id: Date.now(),

      ...formData,

      name: formData.name.trim(),

      email: formData.email.trim(),

      phone: formData.phone.trim(),

      department: formData.department.trim(),

      designation:
        formData.designation.trim(),
    };

    const updatedEmployees = [
      ...employees,
      newEmployee,
    ];

    // ==========================================
    // SAVE EMPLOYEE
    // ==========================================

    localStorage.setItem(
      "employees",
      JSON.stringify(updatedEmployees)
    );

    // ==========================================
    // NOTIFY OTHER PAGES
    // ==========================================

    window.dispatchEvent(
      new Event("employeesUpdated")
    );

    localStorage.setItem(
      "employeeMessage",
      "Employee added successfully!"
    );

    // ==========================================
    // GO TO EMPLOYEES
    // ==========================================

    navigate("/employees");
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <form
      className="employee-form-card"
      onSubmit={handleSubmit}
    >

      {/* EMPLOYEE NAME */}

      <div className="form-group">
        <label>Employee Name</label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter employee name"
          className={
            errors.name
              ? "input-error"
              : ""
          }
        />

        {errors.name && (
          <p className="field-error">
            {errors.name}
          </p>
        )}
      </div>

      {/* EMAIL */}

      <div className="form-group">
        <label>Email</label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          className={
            errors.email
              ? "input-error"
              : ""
          }
        />

        {errors.email && (
          <p className="field-error">
            {errors.email}
          </p>
        )}
      </div>

      {/* PHONE */}

      <div className="form-group">
        <label>Phone Number</label>

        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter 10-digit phone number"
          maxLength="10"
          className={
            errors.phone
              ? "input-error"
              : ""
          }
        />

        {errors.phone && (
          <p className="field-error">
            {errors.phone}
          </p>
        )}
      </div>

      {/* DEPARTMENT */}

      <div className="form-group">
        <label>Department</label>

        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className={
            errors.department
              ? "input-error"
              : ""
          }
        >

          <option value="">
            Select Department
          </option>

          {departments.map((department) => (
            <option
              key={department.id}
              value={department.name}
            >
              {department.name}
            </option>
          ))}

        </select>

        {errors.department && (
          <p className="field-error">
            {errors.department}
          </p>
        )}
      </div>

      {/* DESIGNATION */}

      <div className="form-group">
        <label>Designation</label>

        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="Enter designation"
          className={
            errors.designation
              ? "input-error"
              : ""
          }
        />

        {errors.designation && (
          <p className="field-error">
            {errors.designation}
          </p>
        )}
      </div>

      {/* JOINING DATE */}

      <div className="form-group">
        <label>Joining Date</label>

        <input
          type="date"
          name="joiningDate"
          value={formData.joiningDate}
          onChange={handleChange}
          className={
            errors.joiningDate
              ? "input-error"
              : ""
          }
        />

        {errors.joiningDate && (
          <p className="field-error">
            {errors.joiningDate}
          </p>
        )}
      </div>

      {/* EMPLOYMENT TYPE */}

      <div className="form-group">
        <label>Employment Type</label>

        <select
          name="employmentType"
          value={formData.employmentType}
          onChange={handleChange}
          className={
            errors.employmentType
              ? "input-error"
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
          <p className="field-error">
            {errors.employmentType}
          </p>
        )}
      </div>

      {/* BUTTONS */}

      <div className="employee-form-actions">

        <button
          type="button"
          className="form-cancel-button"
          onClick={() =>
            navigate("/employees")
          }
        >
          Cancel
        </button>

        <button
          type="submit"
          className="form-save-button"
        >
          Save Employee
        </button>

      </div>

    </form>
  );
} 