import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { RegisterData, User } from "./types";
import styles from './Register.module.css';


export function Register() {
    const [registerData, setRegisterData] = useState<RegisterData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [status, setStatus] = useState('');
    const [welcomeMessage, setWelcomeMessage] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (registerData.password !== registerData.confirmPassword) {
            setStatus('Parolele nu coincid!');
            return;
        }

        const newUser: User = {
            firstName: registerData.firstName,
            lastName: registerData.lastName,
            email: registerData.email,
            password: registerData.password
        };

        try {
            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            if (!response.ok) throw new Error('Eroare la înregistrare');

            setStatus('Înregistrare reușită!');
            setWelcomeMessage(`Bun venit, ${newUser.firstName} ${newUser.lastName}!`);

            // Reset form
            setRegisterData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error(error);
            setStatus('Eroare la server. Încearcă din nou.');
        }
    };

    return (
        <div className={styles.card}>
            <h2>Înregistrează un cont</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles['form-group']}>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Prenume"
                        value={registerData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles['form-group']}>
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Nume"
                        value={registerData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles['form-group']}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={registerData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles['form-group']}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Parola"
                        value={registerData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles['form-group']}>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmă parola"
                        value={registerData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Înregistrează-te</button>
            </form>

            {status && <p className={styles.status}>{status}</p>}
            {welcomeMessage && <div className={styles.welcomeMessage}>{welcomeMessage}</div>}
        </div>
    );
}