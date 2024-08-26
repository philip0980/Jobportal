import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, onLogout }) => {
  return (
    <div
      className="nav_container"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <Link to="/">
        <h1>Job Portal</h1>
      </Link>
      <ul style={{ display: "flex", gap: "1rem" }}>
        <Link to="/jobs">
          <li>Jobs</li>
        </Link>
        <Link to="/companies">
          <li>Companies</li>
        </Link>
      </ul>
      <ul>
        {isLoggedIn ? (
          <>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <button onClick={onLogout}>Logout</button>
              <Link to="/profile">
                <h2>Profile</h2>
              </Link>
            </div>
          </>
        ) : (
          <>
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/register">
              <button>Register</button>
            </Link>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
