import { useEffect, useState } from "react";
import { Link } from "react-router";
import { FirstPage } from "../First-page/FirstPage";

import styles from "../../features/Auth/EditUser.module.css"

const apiUrl = `${import.meta.env.VITE_API_URL}/users`;

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: number;
};

// console.log("API URL:", apiUrl);
export function EditUser() {
    const [user, setUser] = useState<User | null>(null);

    // console.log(Object.keys(localStorage));

    useEffect(() => {
        const authRaw = localStorage.getItem("auth");
        if (!authRaw) return;

        const auth = JSON.parse(authRaw);


        fetch(`${apiUrl}/${auth.user.id}`)
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error(err));

    }, []);

    async function updateUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const authRaw = localStorage.getItem("auth");
        if (!authRaw) return;

        const auth = JSON.parse(authRaw);

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

        const body: any = {
            firstName,
            lastName,
            email,
        };

        if (password) {
            body.password = password;
        }

        await fetch(`${apiUrl}/${auth.user.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.accessToken}`
            },
            body: JSON.stringify(body),
        });

        alert("User updated!");
        localStorage.removeItem("auth");
        window.location.href = "/login";
    }

    return (
        <>
            <h2>Edit your data</h2>
            <h4>Important:</h4>
            <p>To change your data,
                without changing your password,</p>
            <p>
                you need to confirm your changes with your current password,</p>
            <p>
                else you can set your new password</p>

            {user && (
                <form onSubmit={updateUser} className={styles.brandForm}>

                    <div className={styles.formGroup}>
                        <label htmlFor="firstName">Change First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            placeholder={`Your first name is ${user.firstName}`}
                            defaultValue={user.firstName}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="lastName">Change Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            placeholder={`Your last name is ${user.lastName}`}
                            defaultValue={user.lastName}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Change Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            placeholder={`Your email is ${user.email}`}
                            defaultValue={user.email}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password"> Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Set your new password"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="retypepassword">Retype your Password</label>
                        <input
                            type="password"
                            id="retypepassword"
                            name="retypepassword"
                            placeholder="Retype your new Password"
                        />
                    </div>

                    <button type="submit">Change</button>
                </form>
            )}

            <Link to="/" onClick={FirstPage}>
                <strong>Cancel</strong>
            </Link>
        </>
    );
}