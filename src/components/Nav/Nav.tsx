import { Link, NavLink } from "react-router";
import logo from "./logoimg.jpg";

import styles from './Nav.module.css';

export function Nav() {
  return (
    <nav className={styles.topNav}>
      <Link to="/" className={styles.logo}>
        <img src={logo} alt="EW-APP Logo" className={styles.logoImg} />
         <span className={styles.ew}>EW</span><span>-</span><span className={styles.app}>APP</span>
      </Link>
      <menu>
        <li>
          <NavLink to="/payments">Payments</NavLink>
        </li>
        <li className={styles.pushRight}>
          <NavLink to="/register">Register</NavLink>
        </li>
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
      </menu>
    </nav>
  )
}

 