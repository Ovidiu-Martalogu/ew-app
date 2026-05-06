import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAuth } from "../../hooks/getUserFromLocalStorage";

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
    const [submitError, setSubmitError] = useState("");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        retypepassword: ""
    });


    const validate = (data = formData) => {
        let newErrors: Errors = {};

        if (!data.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }

        if (!data.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }

        if (!data.email.trim()) {
            newErrors.email = "Email is required";
        }

        if (data.password) {
            if (data.password.length < 6) {
                newErrors.password = "Password must be at least 6 characters";
            }

            if (data.password !== data.retypepassword) {
                newErrors.retypepassword = "Passwords do not match";
            }
        }

        return newErrors;
    };

    useEffect(() => {
        const auth = getAuth();
        if (!auth?.user?.id) return;
        ;


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
                setFormData({
                    id: data.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: "",
                    retypepassword: "",
                });
            })
            .catch((err) => {
                setErrors({ general: err.message });
            });
    }, []);


    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {

        const { name, value } = e.target;

        const updatedForm = {
            ...formData,
            [name]: value
        };

        setFormData(updatedForm);

        const fieldErrors = validate(updatedForm);

        setErrors(prev => ({
            ...prev,
            [name]: fieldErrors[name] || ""
        }));

    }
    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();

        const validationErrors = validate();


        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const res = await fetch(`${apiUrl}/${formData.id}`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    id: formData.id,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password || undefined,
                }),
            });

            if (!res.ok) {
                throw new Error("Update failed.There are fields left blank!");
            }

            alert("User updated successfully");

            localStorage.removeItem("auth");
            window.location.href = "/login";
        } catch (err: any) {
            setSubmitError(err.message);
        }
    }


    return (
        <>
            {user && (
                <form onSubmit={handleSubmit} className={styles.brandForm}>
                    <div>
                        <h3>Edit your data</h3>
                        <h4>Important:</h4>
                        <p>To change your data, without changing your password,</p>
                        <p> you need to confirm your changes with your current password.</p>

                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            placeholder="First name"
                            onChange={handleChange}
                        />
                        {errors.firstName && <p className={styles.errorMsg}>{errors.firstName || ""}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            placeholder="Last name"
                            onChange={handleChange}
                        />
                        {errors.lastName && <p className={styles.errorMsg}>{errors.lastName || ""}</p>}

                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email}
                            placeholder="Email"
                            onChange={handleChange}
                        />
                        {errors.email && <p className={styles.errorMsg}>{errors.email || ""}</p>}

                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            placeholder="New password"
                            onChange={handleChange}
                        />
                        {errors.password && <p className={styles.errorMsg}>{errors.password || ""}</p>}

                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="retypepassword">Retype Password</label>
                        <input
                            type="password"
                            id="retypepassword"
                            name="retypepassword"
                            value={formData.retypepassword}
                            placeholder="Retype password"
                            onChange={handleChange}
                        />
                        {errors.retypepassword && <p className={styles.errorMsg}>{errors.retypepassword || ""}</p>}

                    </div>

                    <div className={styles.formButtons}>
                        <button type="submit" className={styles.edituserButton}>Update</button>
                    </div>
                    {submitError && <p className={styles.errorMsg}>{submitError}</p>}
                    <div className={styles.cancelButtonDiv}>
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

        </>
    );
}