import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../logos/Horizontal_logo-removebg-preview.png";


function Navbar() {
  const nav = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // LOGOUT
  const logout = () => {
    sessionStorage.clear();
    nav("/login");
  };

  // 🔑 DASHBOARD CLICK HANDLER (MAIN CHANGE)
  const handleDashboardClick = (e) => {
    e.preventDefault(); // stop default NavLink navigation

    if (!user) {
      nav("/login");
    } else {
      nav("/dashboard");
    }
  };

  return (
    <div className="navbar-wrapper">
      <div className="navbar-inner">

        {/* LEFT */}
        {/* <div className="navbar-title" onClick={() => nav("/")}>
          CDAC Quiz System
        </div> */}

        <div className="navbar-title" onClick={() => nav("/")}>
          <img src={logo} alt="CDAC Quiz System" className="navbar-logo" />
        </div>


        {/* CENTER */}
        <div className="navbar-tabs">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            Home
          </NavLink>

          <NavLink
            to="/dashboard"
            onClick={handleDashboardClick}
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            Dashboard
          </NavLink>
        </div>

        {/* RIGHT */}
        {user && (
          <div className="profile-area" ref={menuRef}>
            <div
              className="profile-chip"
              onClick={() => setOpen(!open)}
            >
              <span>Welcome, {user.fullName}</span>
              <div className="avatar">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
            </div>

            {open && (
              <div className="profile-dropdown">
                <p className="profile-name">Hi, {user.fullName}!</p>
                <button className="logout-btn" onClick={logout}>
                  Log out
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default Navbar;
