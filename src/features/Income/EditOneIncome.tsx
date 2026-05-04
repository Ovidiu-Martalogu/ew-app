import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import styles from "../Income/EditOneIncome.module.css";


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

export function EditOneIncome() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        date: "",
        amount: "",
        type: "",
        category: "",
        details: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!id) return;

        fetch(`${apiUrl}/${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch income");
                }
                return res.json();
            })
            .then((data: Income) => {
                setForm({
                    date: data.date,
                    amount: String(data.amount),
                    category: data.category,
                    type: data.type,
                    details: data.details
                });
            })
            .catch(err => {
                console.error(err);
            })

    }, [id]);

    //my validateField

    function validateField(name: string, value: string) {
        if (!value || value.trim() === "") {
            return ` Please complete the ${name} field`;
        }

        if (name === "amount") {
            if (isNaN(Number(value))) {
                return "Amount must be a number";
            }
            if (Number(value) <= 0) {
                return "The sum must be positive";
            }
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
        if (!id) return;

        await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date: form.date,
                amount: Number(form.amount),
                type: form.type,
                deleted: false,
                details: form.details,
                category: form.category,
            }),
        });

        navigate("/income");
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
                        value={form.date}
                        onChange={handleChange}
                    />
                    {errors.date && <p className={styles.error}>{errors.date}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="amount">Amount</label>
                    <input
                        id="amount"
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                    />
                    {errors.amount && <p className={styles.error}>{errors.amount}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="type">Type</label>
                    <select
                        id="type"
                        name="type"
                        value={form.type}
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
                        value={form.category}
                        onChange={handleChange}
                    />
                    {errors.category && <p className={styles.error}>{errors.category}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="details">Details</label>
                    <input
                        id="details"
                        type="text"
                        name="details"
                        value={form.details}
                        onChange={handleChange}
                    />
                    {errors.details && <p className={styles.error}>{errors.details}</p>}
                </div>

                <button type="submit" className={styles.buttonEditIncome}>Update</button>
            </form>

            <NavLink to="/income" className={styles.buttonBack}>Back</NavLink>
        </div>
    );
}