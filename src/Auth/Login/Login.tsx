import { useState, type ChangeEvent} from 'react';
import type { LoginData, User } from "./types";
import styles from './Login.module.css';


export function Login() {
    const [loginData, setLoginData] = useState<LoginData>({ email: '', password: '' });
    const [status, setStatus] = useState('');
    const [welcomeMessage, setWelcomeMessage] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!loginData.email || !loginData.password) {
            setStatus('Te rugăm să completezi toate câmpurile.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/users');
           
           console.log(response);
           
           
            const users: User[] = await response.json();

            const user = users.find(
                u => u.email === loginData.email && u.password === loginData.password
              
            );


            if (user) {
                setStatus('Autentificare reușită!');
                setWelcomeMessage(`Bun venit, ${user.firstName} ${user.lastName}!`);
                setLoginData({ email: '', password: '' });
                
                localStorage.setItem("user", JSON.stringify(user));
            } else {
                setStatus('Email sau parola incorectă.');
            }
        } catch (error) {

            setStatus('Eroare la conectarea la server.');
        }
    };

    return (
        <div className={styles.card}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles['form-group']}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={loginData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles['form-group']}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button className={styles.button} type="submit">Login</button>
            </form>
            {status && <p className={styles.status}>{status}</p>}
            {welcomeMessage && <div className={styles.welcomeMessage}>{welcomeMessage}</div>}
        </div>
    );
}