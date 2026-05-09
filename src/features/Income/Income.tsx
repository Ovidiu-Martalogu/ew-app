import { useEffect, useState } from "react";
import { NavLink, } from "react-router";
import { getAuth } from "../../hooks/getUserFromLocalStorage";
import type { Income } from "./types";

import styles from "./income.module.css";

const apiUrl = `${import.meta.env.VITE_API_URL}/income`;

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

export function Income() {
    const [income, setIncome] = useState<Income[] | null>(null);
    const [addIncome, setAddIncome] = useState(false);
    const [type, setType] = useState<"active" | "passive">("active");

    const [errors, setErrors] = useState<Errors>({});
    const [submitError, setSubmitError] = useState("");

    const [insertdetails, setInsertDetails] = useState("")


    const buttonAddIncome = () => {
        setAddIncome(!addIncome);
    };

    const validate = (data: {
        date: string;
        amount: string;
        type: string;
        category: string;
        details: string;
    }) => {
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
        const auth = getAuth();
        if (!auth?.user?.id) return;
        ;
        console.log(auth.user.id);

        if (!auth.user.id) return;

        fetch(`${apiUrl}?userId=${auth.user.id}`, {
            headers: getAuthHeaders(),
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch.");
                }
                return res.json();
            })
            .then((data) => setIncome(data))
            .catch((err) => {
                setErrors({ general: err.message });
            });
    }, []);

    async function addIncomeToDB(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!addIncome) return;

        const form = new FormData(e.currentTarget);

        const data = {
            date: String(form.get("date") || ""),
            amount: String(form.get("amount") || ""),
            type: String(form.get("type") || ""),
            category: String(form.get("category") || ""),
            details: String(form.get("details") || "")
        };

        const validationErrors = validate(data);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const auth = getAuth();
        const userId = auth.user.id;

        if (!userId) {
            alert("User not logged in");
            return;
        }

        try {

            const res = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    amount: Number(data.amount),
                    type: data.type === "active" ? "active" : "passive",
                    deleted: false,
                    userId: userId
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to add income");
            }

            const newIncome = await res.json();

            setIncome(prev => [...(prev ?? []), newIncome]);
            setAddIncome(false);
            setType("active");
            setErrors({});
            setInsertDetails("");

        } catch (err: any) {
            setSubmitError(err.message);
        }
    }

    async function deleteIncome(id: number) {
        const ok = window.confirm("Are you sure?");
        if (!ok) return;

        await fetch(`${apiUrl}/${id}`, {
            method: "DELETE",
        });

        setIncome((prev) =>
            prev ? prev.filter((item) => item.id !== id) : prev
        );
    }

    const total = income?.reduce((sum, p) => {
        return sum + Number(p.amount);
    }, 0);

    const getCategoryColor = (category?: string) => {
        const colors = {
            active: "#9C27B0",
            passive: "#FF9800",
        };

        return colors[category?.toLowerCase() as keyof typeof colors] || "#607D8B";
    };

    const renderForm = (
        <form onSubmit={addIncomeToDB} className={styles.formAddIncome}>
            <div className={styles.formGroup}>
                <label htmlFor="type"> Type:</label>
                <select
                    id="type"
                    name="type"
                    value={type}
                    onChange={(e) =>
                        setType(e.target.value as "active" | "passive")
                    }
                >
                    <option value="active">Active</option>
                    <option value="passive">Passive</option>
                </select>
                {errors.type && <p>{errors.type}</p>}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="date"> Date: </label>
                <input
                    id="date"
                    type="date"
                    name="date"
                    className={styles.input}
                />
                {errors.date && <p className={styles.error}>{errors.date || ""}</p>}

            </div>

            <div className={styles.formGroup}>
                <label htmlFor="amount">Amount:</label>
                <input
                    id="amount"
                    type="number"
                    name="amount"
                    className={styles.input}
                />
                {errors.amount && <p className={styles.error}>{errors.amount || ""}</p>}

            </div>

            <div className={styles.formGroup}>
                <label htmlFor="category">Category:</label>
                <input
                    id="category"
                    type="text"
                    name="category"
                    className={styles.input}
                />
                {errors.category && <p className={styles.error}>{errors.category || ""}</p>}

            </div>

            <div className={styles.formGroup}>
                <label htmlFor="details">Details:</label>
                <textarea
                    id="details"

                    name="details"
                    value={insertdetails}
                    onChange={(e) => setInsertDetails(e.target.value)}
                    className={styles.input}

                />
                {errors.details && <p className={styles.error}>{errors.details || ""}</p>}
            </div>

            <button type="submit" className={styles.addIncomeButton}>
                Add Income
            </button>

            {submitError && <p className={styles.error}>{submitError}</p>}
        </form>
    );

    if (!income || income.length === 0) {
        return (
            <>
                <div className={styles.content}>
                    <h1 className={styles.notIncomeMsg}>
                        <strong>You don't have any incomes. Please add.</strong>
                    </h1>

                    <div>
                        {addIncome && renderForm}

                        <button onClick={buttonAddIncome} className={styles.addIncomeButton}>
                            {addIncome ? "Back" : "Add new Income"}
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className={styles.content}>
            <h1>Income</h1>

            <div>
                {addIncome && renderForm}

                <button onClick={buttonAddIncome} className={styles.addIncomeButton}>
                    {addIncome ? "Back" : "Add new Income"}
                </button>
            </div>
            <div className={styles.cardContainer}>
                {income?.map((item) => (
                    <div
                        key={item.id}
                        className={styles.card}
                        style={{
                            borderTop: `6px solid ${getCategoryColor(item.type)}`,
                        }}
                    >
                        <p>This is
                            <strong> {item.type} </strong>
                            income
                        </p>
                        <p>
                            <strong>Date:</strong> {item.date}
                        </p>
                        <p>
                            <strong>Amount:</strong> {item.amount}
                        </p>
                        <p>
                            <strong>category:</strong> {item.category}
                        </p>
                        <p>
                            <strong>details:</strong> {item.details}
                        </p>

                        <div className={styles.cardActions}>
                            <NavLink to={`/income/edit/${item.id}`}
                                className={styles.editLink}>
                                Edit
                            </NavLink>

                            <button onClick={() => deleteIncome(item.id)}
                                className={styles.deleteButton}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <h2 className={styles.showTotal}>Total: {total?.toFixed(2)}</h2>
        </div>
    );
}