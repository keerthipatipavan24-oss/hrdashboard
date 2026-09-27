import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-brand">
        <h1>HR</h1>
        <h1>DASHBOARD</h1>

        <p>HR MANAGEMENT</p>
      </div>
 
      <nav className="sidebar-nav">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        > 
          <span>▦</span>
          <span>Dashboard</span>
        </NavLink>


        <NavLink
          to="/employees"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <span>♟</span>
          <span>Employees</span>
        </NavLink>


        <NavLink
          to="/departments"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <span>▤</span>
          <span>Departments</span>
        </NavLink>


        <NavLink
          to="/attendance"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <span>✓</span>
          <span>Attendance</span>
        </NavLink>


        <NavLink
          to="/leave"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <span>▱</span>
          <span>Leave</span>
        </NavLink>


        <NavLink
          to="/performance"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <span>▥</span>
          <span>Performance</span>
        </NavLink>

      </nav>

    </aside>
  );
} 