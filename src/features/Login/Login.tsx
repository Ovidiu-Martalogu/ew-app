import { useState, type ChangeEvent, type FormEvent } from 'react';
import styles from './Login.module.css';

interface LoginData {
    email: string;
    password: string;
}

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export function Login() {
    const [loginData, setLoginData] = useState<LoginData>({ email: '', password: '' });
    const [status, setStatus] = useState('');
    const [welcomeMessage, setWelcomeMessage] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!loginData.email || !loginData.password) {
            setStatus('Te rugăm să completezi toate câmpurile.');
            return;
        }

        try {
            const response = await fetch('/db.json'); // or your JSON Server endpoint
            if (!response.ok) throw new Error('Failed to fetch users');
            const data: { users: User[] } = await response.json();

            const user = data.users.find(
                u => u.email === loginData.email && u.password === loginData.password
            );

            if (user) {
                setStatus('Autentificare reușită!');
                setWelcomeMessage(`Bun venit, ${user.firstName} ${user.lastName}!`);
                setLoginData({ email: '', password: '' });
            } else {
                setStatus('Email sau parola incorectă.');
            }
        } catch (error) {
            console.error(error);
            setStatus('Eroare la conectarea la server.');
        }
    };

    return (
        <div className={styles.card}>
            <h2>Autentificare</h2>
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
                        placeholder="Parola"
                        value={loginData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Autentifică-te</button>
            </form>
            {status && <p className={styles.status}>{status}</p>}
            {welcomeMessage && <div className={styles.welcomeMessage}>{welcomeMessage}</div>}
        </div>
    );
}