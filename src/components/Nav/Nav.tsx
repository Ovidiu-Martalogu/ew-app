import { useState } from "react";
import { Link, NavLink } from "react-router";
import { EditUser } from "../../features/Auth/EditUser";
import { useAuth } from "../../features/Auth/context/useAuth";
import logo from "./logoimg.jpg";
import styles from "./Nav.module.css";




export function Nav() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className={styles.topNav}>

      <Link to="/" className={styles.logo}>
        <img src={logo} alt="EW-APP Logo" className={styles.logoImg} />
        <span className={styles.ew}>EW</span>
        <span>-</span>
        <span className={styles.app}>APP</span>
      </Link>

     
      <button
        className={styles.menuToggle}
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

     
      <menu className={`${styles.menu} ${open ? styles.show : ""}`}>

        <li>
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
        </li>

        <li>
          <NavLink to="/report" onClick={() => setOpen(false)}>Report</NavLink>
        </li>

        <li>
          <NavLink to="/payments" onClick={() => setOpen(false)}>Payments</NavLink>
        </li>

        <li>
          <NavLink to="/income" onClick={() => setOpen(false)}>Income</NavLink>
        </li>

        {!user && (
          <>
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
          </>
        )}

        {user && (
          <>
            <li className={styles.wellcomeMsg}>
              <Link to="/user" onClick={EditUser}>
                Welcome, <strong className={styles.app}>{user.firstName}!</strong>
              </Link>
            </li>

            <li className={styles.logout}>
              <Link to="/" onClick={logout}>
                Logout
              </Link>
            </li>
          </>
        )}

      </menu>

    </nav>
  );
  
}