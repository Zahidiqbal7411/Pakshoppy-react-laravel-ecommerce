import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <NavLink className="navbar-brand" to="/dashboard">
        🛍️ Admin Dashboard
      </NavLink>

      {/* Toggle for mobile view */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#adminNavbar"
        aria-controls="adminNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="adminNavbar">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/notifications">
              🔔 Notifications
            </NavLink>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#!"
              id="profileDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              👤 Admin
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
              <li>
                <NavLink className="dropdown-item" to="/profile">Profile</NavLink>
              </li>
              <li>
                <NavLink className="dropdown-item" to="/settings">Settings</NavLink>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <NavLink className="dropdown-item text-danger" to="/login">Logout</NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}
