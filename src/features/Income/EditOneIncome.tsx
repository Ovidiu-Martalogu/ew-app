import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import styles from "../Income/EditOneIncome.module.css";
import { getAuth } from "../../hooks/getUserFromLocalStorage";


const apiUrl = `${import.meta.env.VITE_API_URL}/income`;

type Income = {
    id: number;
    userId: number;
    date: string;
    amount: number;
    deleted: boolean;
    type: string;
    category: string;
    details: string

};

type Errors = {
    [key: string]: string;
};

export function EditOneIncome() {
    const { id } = useParams();

    const [errors, setErrors] = useState<Errors>({});
    const [submitError, setSubmitError] = useState("");

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        date: "",
        amount: "",
        type: "",
        category: "",
        details: "",

    });

    const validate = (data = formData) => {
        let newErrors: Errors = {};

        if (!data.date.trim()) {
            newErrors.date = "Date is required";
        }

        const amountNumber = Number(data.amount);

        if (!data.amount.trim() || isNaN(amountNumber) || amountNumber < 0) {
            newErrors.amount = "Amount must be a positive number";
        }

        if (!data.type.trim()) {
            newErrors.type = "Type is required";
        }

        if (!data.category.trim()) {
            newErrors.category = "Category is required";
        }
        if (!data.details.trim()) {
            newErrors.details = "Details is required";
        }

        return newErrors;
    };

    useEffect(() => {
        if (!id) return;

        fetch(`${apiUrl}/${id}`)
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch income");
                }
                return res.json();
            })
            .then((data: Income) => {
                setFormData({
                    date: data.date,
                    amount: String(data.amount),
                    category: data.category,
                    type: data.type,
                    details: data.details
                });
            })
            .catch((err) => {
                setErrors({ general: err.message });
            })

    }, [id]);


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
        if (!id) return;

        const validationErrors = validate();


        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSubmitError("Please fix the errors before submitting");
            return;
        }
        const auth = getAuth();
        const userId = auth.user.id;
        try {
            await fetch(`${apiUrl}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date: formData.date,
                    amount: Number(formData.amount),
                    type: formData.type,
                    deleted: false,
                    details: formData.details,
                    category: formData.category,
                    userId: userId

                }),
            });

            window.alert(`Update with succes`)
            navigate("/income");

        } catch (err: any) {
            setSubmitError(err.message);
        }
    }

    return (
        <div className={styles.content}>
            <h1>Edit Income</h1>

            <form onSubmit={handleSubmit} className={`${styles.card} ${styles.form}`}>
                <div className={styles.formGroup}>
                    <label htmlFor="date">Date</label>
                    <input
                        id="date"
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                    {errors.date && <p className={styles.error}>{errors.date || ""}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="amount">Amount</label>
                    <input
                        id="amount"
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                    />
                    {errors.amount && <p className={styles.error}>{errors.amount || ""}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="type">Type</label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option value="active">Active</option>
                        <option value="passive">Passive</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="category">Category</label>
                    <input
                        id="category"
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    />
                    {errors.category && <p className={styles.error}>{errors.category || ""}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="details">Details</label>
                    <input
                        id="details"
                        type="text"
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                    />
                    {errors.details && <p className={styles.error}>{errors.details || ""}</p>}
                </div>

                <button type="submit" className={styles.buttonEditIncome}>Update</button>
                {submitError && <p className={styles.error}>{submitError}</p>}
            </form>

            <NavLink to="/income" className={styles.buttonBack}>Back</NavLink>
        </div>
    );
}