import { useState } from "react";

import { Link, NavLink } from "react-router";
import logo from "./logoimg.jpg";
import styles from "./Footer.module.css";

export function Footer() {
    const [open, setOpen] = useState(false);

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>

                <div>
                    <Link to="/" className={styles.logo}>
                        <img src={logo} alt="EW-APP Logo" className={styles.logoImg} />
                        <span className={styles.ew}>EW</span>
                        <span>-</span>
                        <span className={styles.app}>APP</span>
                    </Link>
                    <p className={styles.text}>
                        Monitorizează-ți cheltuielile ușor și rapid.
                    </p>
                </div>

                <div className={styles.links}>
                    <h4>Links</h4>
                    <menu className={`${styles.links} ${open ? styles.show : ""}`}>
                       
                        <li>
                            <NavLink to="/" onClick={() => setOpen(false)}>
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/payments" onClick={() => setOpen(false)}>
                                Payments
                            </NavLink>
                        </li>
                        <li>
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
                </div>

                {/* <div className={styles.links}>
                    <h4>Support</h4>
                    <a href="#">Help</a>
                    <a href="#">Contact</a>
                    <a href="#">FAQ</a>
                </div> */}

            </div>

            <div className={styles.bottom}>
                © {new Date().getFullYear()} <span className={styles.ew}>EW</span>
                <span>-</span>
                <span className={styles.app}>APP</span>
            </div>
        </footer>
    );
}