import { useEffect, useState } from "react";
import { Link } from "react-router";
import { FirstPage } from "../First-page/FirstPage";

import styles from "../../features/Auth/EditUser.module.css";

const apiUrl = `${import.meta.env.VITE_API_URL}/users`;

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
};


function getAuth() {
    const authRaw = localStorage.getItem("auth");
    if (!authRaw) return null;
    return JSON.parse(authRaw);
}

function getAuthHeaders(): HeadersInit {
    const auth = getAuth();

    return {
        "Content-Type": "application/json",
        ...(auth?.accessToken
            ? { Authorization: `Bearer ${auth.accessToken}` }
            : {}),
    };
}

export function EditUser() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const auth = getAuth();
        if (!auth?.user?.id) return;

        fetch(`${apiUrl}/${auth.user.id}`, {
            headers: getAuthHeaders(),
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch user (401 or server error)");
                }
                return res.json();
            })
            .then((data) => setUser(data))
            .catch((err) => {
                console.error(err);
                setError(err.message);
            });
    }, []);

    async function updateUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const auth = getAuth();
        if (!auth?.user?.id) return;

        const form = new FormData(e.currentTarget);

        const firstName = form.get("firstName") as string;
        const lastName = form.get("lastName") as string;
        const email = form.get("email") as string;
        const password = form.get("password") as string;
        const retypePassword = form.get("retypepassword") as string;

        if (password && password !== retypePassword) {
            alert("Passwords do not match");
            return;
        }

        const body: Record<string, string> = {
            firstName,
            lastName,
            email,
        };

        if (password) {
            body.password = password;
        }

        try {
            const res = await fetch(`${apiUrl}/${auth.user.id}`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                throw new Error("Failed to update user");
            }

            alert("User updated successfully");

            localStorage.removeItem("auth");
            window.location.href = "/login";
        } catch (err: any) {
            console.error(err);
            alert(err.message);
        }
    }

    return (
        <>
            <div>
                <h2>Edit your data</h2>
                <h4>Important:</h4>
                <p>To change your data, without changing your password,</p>
                <p> you need to confirm your changes with your current password,</p>
                <p> else you can set your new password</p>
            </div>
            <h2>Edit your data</h2>

            {error && <p className={styles.errorMsg}>{error}</p>}

            {user && (
                <form onSubmit={updateUser} className={styles.brandForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            defaultValue={user.firstName}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            defaultValue={user.lastName}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            defaultValue={user.email}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="retypepassword">Retype Password</label>
                        <input
                            type="password"
                            id="retypepassword"
                            name="retypepassword"
                        />
                    </div>

                    <button type="submit">Update</button>
                </form>
            )}

            <Link to="/" onClick={FirstPage}>
                <strong>Cancel</strong>
            </Link>
        </>
    );
}