import { useEffect, useState } from "react";
import { useNavigate } from "react-router";


import styles from "../../features/Auth/EditUser.module.css";



const apiUrl = `${import.meta.env.VITE_API_URL}/users`;

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
};

type Errors = {
    [key: string]: string;
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
    const [errors, setErrors] = useState<Errors>({});
    const navigate = useNavigate();
    const [form, setForm] = useState({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        retypepassword: ""
    });

    useEffect(() => {
        const auth = getAuth();
        // if (!auth?.user?.id) return;

        fetch(`${apiUrl}/${auth.user.id}`, {
            headers: getAuthHeaders(),
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch user (401 or server error)");
                }
                return res.json();
            })
            .then((data) => {
                setUser(data);
                setForm({
                    id: data.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: "",
                    retypepassword: "",
                });
            })
            .catch((err) => {
                console.error(err);
                setErrors({ general: err.message });
            });
    }, []);


    //my validateField 

    function validateField(name: string, value: string) {
        if (!value || value.trim() === "") {
            return `Please complete the ${name} field`
        }
        if (name === "password" && value.length < 6) {
            return "Your password must be at least 6 characters";
        }
        return "";
    }


    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {

        const { name, value } = e.target;

        setForm(prev => ({ ...prev, [name]: value }));

        const errorMessage = validateField(name, value);

        setErrors((prev) => ({
            ...prev,
            [name]: errorMessage,
        }));

    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const newErrors: any = {};


        if (form.password && form.password !== form.retypepassword) {
            newErrors.retypepassword = "Passwords do not match";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }


        const res = await fetch(`${apiUrl}/${form.id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                id: form.id,
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                password: form.password || undefined,
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            setErrors({ general: err });
            return;
        }


        localStorage.removeItem("auth");
        navigate("/login");
    }


    return (
        <>
            {user && (
                <form onSubmit={handleSubmit} className={styles.brandForm}>
                    <div>
                        <h3>Edit your data</h3>
                        <h4>Important:</h4>
                        <p>To change your data, without changing your password,</p>
                        <p> you need to confirm your changes with your current password,</p>
                        <p> else you can set your new password</p>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                           
                            onChange={handleChange}
                        />
                        {errors.firstName && <p style={{ color: "red" }}>{errors.firstName}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                           
                            onChange={handleChange}
                        />
                        {errors.lastName && <p style={{ color: "red" }}>{errors.lastName}</p>}

                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                        
                            onChange={handleChange}
                        />
                        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={handleChange}
                        />
                        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="retypepassword">Retype Password</label>
                        <input
                            type="password"
                            id="retypepassword"
                            name="retypepassword"
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formButtons}>
                        <button type="submit" className={styles.edituserButton}>Update</button>
                    </div>

                </form>
            )}
            <div className={styles.formButtons}>
                <button
                    type="button"
                    className={styles.edituserButton}
                    onClick={() => navigate("/")}
                >
                    Cancel
                </button>
            </div>

        </>
    );
}