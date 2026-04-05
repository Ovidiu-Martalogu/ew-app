import { useState } from "react";
import { Link, NavLink } from "react-router";
import logo from "./logoimg.jpg";
import styles from "./Nav.module.css";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className={styles.topNav}>
      <Link to="/" className={styles.logo}>
        <img src={logo} alt="EW-APP Logo" className={styles.logoImg} />
        <span className={styles.ew}>EW</span>
        <span>-</span>
        <span className={styles.app}>APP</span>

      </Link>
      <menu className={`${styles.menu} ${open ? styles.show : ""}`}>
        <li>
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
        </li>
      </menu>
      <menu className={`${styles.menu} ${open ? styles.show : ""}`}>
        <li>
          <NavLink to="/payments" onClick={() => setOpen(false)}>
            Payments
          </NavLink>
        </li>
        <li>
          <NavLink to="/income" onClick={() => setOpen(false)}>
            Income
          </NavLink>
        </li>

      </menu>

      {/* Hamburger button */}
      <button
        className={styles.menuToggle}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <menu className={`${styles.menu} ${open ? styles.show : ""}`}>
        <li className={styles.pushRight}>
          <NavLink to="/register" onClick={() => setOpen(false)}>
            Register
          </NavLink>
        </li>
        <li>
          <NavLink to="/login" onClick={() => setOpen(false)}>
            Login
          </NavLink>
        </li>
      </menu>
    </nav>
  );
}