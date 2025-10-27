import React, { useState, useEffect } from "react";
import classes from "./header.module.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.logo}>
        <img
          src="https://evanforum.com/assets/logo-D98Zk6nH.png"
          alt="Evangadi Logo"
          className={classes.logoImage}
        />
      </div>

      <div className={`${classes.links} ${menuOpen ? classes.show : ""}`}>
        <Link to="/" className={classes.link}>
          Home
        </Link>
        <Link to="/how-it-works" className={classes.link}>
          How it works
        </Link>
        {isLoggedIn ? (
          <button className={classes.logoutBtn} onClick={handleAuthClick}>
            Log Out
          </button>
        ) : (
          <button className={classes.loginBtn} onClick={handleAuthClick}>
            Sign In
          </button>
        )}
      </div>

      <button className={classes.hamburger} onClick={toggleMenu}>
        ☰
      </button>
    </nav>
  );
};

export default Navbar;
