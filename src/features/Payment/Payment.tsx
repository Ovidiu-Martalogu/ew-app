import { useEffect, useState } from "react";
import type { Payment, SortChoice } from "./types";
import { getAuth } from "../../hooks/getUserFromLocalStorage";

import styles from './Payment.module.css';

const apiUrl = `${import.meta.env.VITE_API_URL}/payments`;

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

export function Payment() {
    const [payment, setpayment] = useState<Payment[] | null>(null);
    const [addPayment, setAddPayment] = useState(false);
    const [sortField, setSortField] = useState<"date" | "amount" | null>(null);
    const [sortChoice, setSortChoice] = useState<SortChoice>("ascending");

    const [errors, setErrors] = useState<Errors>({});
    const [submitError, setSubmitError] = useState("");

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({
        date: "",
        amount: "",
        category: "",
    });

    const buttonAddPayment = () => {
        setAddPayment(!addPayment);
    };


    const validate = (data: {
        date: string;
        amount: string;
        category: string;

    }) => {
        let newErrors: Errors = {};

        if (!data.date.trim()) {
            newErrors.date = "Date is required";
        }

        const amountNumber = Number(data.amount);

        if (!data.amount.trim() || isNaN(amountNumber) || amountNumber < 0) {
            newErrors.amount = "Amount must be a positive number";
        }

        if (!data.category.trim()) {
            newErrors.category = "Category is required";
        }

        return newErrors;
    };

    //get Payment from DB
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

            .then((data) => setpayment(data))
            .catch((err) => {
                setErrors({ general: err.message });
            });

    }, []);


    async function addPaymentsToDB(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!addPayment) return;

        const form = new FormData(e.currentTarget);

        const data = {
            date: String(form.get("date") || ""),
            amount: String(form.get("amount") || ""),
            category: String(form.get("category") || "")
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
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    amount: Number(data.amount),
                    userId: userId
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add payment");
            }

            const newPayment = await response.json();

            setpayment([...(payment ?? []), newPayment]);
            setAddPayment(false);
        } catch (err: any) {
            setSubmitError(err.message);

        }
    }

    async function saveEdit(id: number) {
        const updated = {
            ...editForm,
            amount: Number(editForm.amount),
        };

        const response = await fetch(`${apiUrl}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updated),
        });

        const data = await response.json();

        setpayment((prev) =>
            prev
                ? prev.map((item) =>
                    item.id === id ? data : item
                )
                : prev
        );

        setEditingId(null);
    }
    async function deletePayment(id: number) {
        const ok = window.confirm("Sigur vrei să ștergi această înregistrare?");
        if (!ok) return;

        await fetch(`${apiUrl}/${id}`, {
            method: "DELETE",
        });

        setpayment((prev) =>
            prev ? prev.filter((item) => item.id !== id) : prev
        );
    };
    //sort payments
    const sortedPayments = [...(payment ?? [])].sort((a, b) => {
        if (!sortField) return 0;

        let result = 0;

        if (sortField === "amount") {
            result = Number(a.amount) - Number(b.amount);
        }

        if (sortField === "date") {
            result =
                new Date(a.date).getTime() - new Date(b.date).getTime();
        }

        return sortChoice === "descending" ? -result : result;
    });

    const total = sortedPayments.reduce((sum, p) => {
        return sum + Number(p.amount);
    }, 0);

    const renderForm = (
        <form onSubmit={addPaymentsToDB} className={styles.formAddPayment}>

            <div className={styles.formGroup}>
                <label htmlFor="date">Select the date:</label>
                <input
                    id="date"
                    type="date"
                    name="date"
                    className={styles.input}
                />
                {errors.date && <p className={styles.error}>{errors.date || ""}</p>}

            </div>
            <div className={styles.formGroup}>
                <label htmlFor="amount" > Insert the amount: </label>
                <input
                    id="amount"
                    type="number"
                    name="amount"
                    className={styles.input}
                />
                {errors.amount && <p className={styles.error}>{errors.amount || ""}</p>}

            </div>

            <div className={styles.formGroup}>

                <label htmlFor="category" > Insert the category:</label>
                <input
                    id="category"
                    type="text"
                    name="category"
                    className={styles.input}
                />
                {errors.category && <p className={styles.error}>{errors.category || ""}</p>}

            </div>
            <div className={styles.formGroup}>
                <button type="submit" className={styles.addPaymentButton}>
                    Add Payment
                </button>
                {submitError && <p className={styles.error}>{submitError}</p>}

            </div>
        </form>
    )

    if (!payment || payment.length === 0) {
        return (
            <>
                <div className={styles.content}>


                    <h2 className={styles.notPaymentMsg}>
                        <strong>You don't have any payments. Please add payments.</strong>
                    </h2>
                    <div>

                        {addPayment && renderForm}

                        <button onClick={buttonAddPayment} className={styles.addPaymentButton}>
                            {addPayment ? "Back" : "Add new Payment"}
                        </button>
                    </div>
                </div>
            </>
        )
    }
    return (
        <>
            <div className={styles.content}>
                <h1 className={styles.title}>Payment</h1>

                <div>
                    {addPayment && renderForm}

                    <button onClick={buttonAddPayment} className={styles.addPaymentButton}>
                        {addPayment ? "Back" : "Add new Payment"}
                    </button>
                </div>

                <div className={styles.sortBar}>
                    <button onClick={() => setSortField("date")} className={styles.addPaymentButton}>
                        <label htmlFor="sort">
                            Sort by Date{" "}</label>
                        <select
                            id="sort"
                            name="sort"
                            className={styles.selectAmount}
                            onChange={(e) => setSortChoice(e.target.value as SortChoice)}
                        >
                            <option value="ascending">Ascending</option>
                            <option value="descending">Descending</option>
                        </select>

                    </button>

                    <button onClick={() => setSortField("amount")} className={styles.addPaymentButton}>
                        <label htmlFor="sortAmount">
                            Sort by Amount{" "} </label>
                        <select
                            id="sortAmount"
                            name="sortAmount"
                            className={styles.selectAmount}
                            onChange={(e) => setSortChoice(e.target.value as SortChoice)}
                        >
                            <option value="ascending">Ascending</option>
                            <option value="descending">Descending</option>
                        </select>

                    </button>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Category</th>
                                <th className={styles.twoLines}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sortedPayments.map((key) => (
                                <tr key={key.id}>

                                    <td>
                                        {editingId === key.id ? (
                                            <><label htmlFor="date">Date</label>
                                                <input
                                                    id="date"
                                                    name="date"
                                                    type="date"
                                                    value={editForm.date}
                                                    onChange={(e) =>
                                                        setEditForm({ ...editForm, date: e.target.value })
                                                    }
                                                />
                                            </>
                                        ) : (
                                            key.date
                                        )}
                                    </td>

                                    <td>
                                        {editingId === key.id ? (
                                            <><label htmlFor="amount">Amount</label>
                                                <input
                                                    id="amount"
                                                    type="number"
                                                    name="amount"
                                                    value={editForm.amount}
                                                    onChange={(e) =>
                                                        setEditForm({ ...editForm, amount: e.target.value })
                                                    }
                                                />
                                            </>
                                        ) : (
                                            key.amount
                                        )}
                                    </td>

                                    <td>
                                        {editingId === key.id ? (
                                            <>
                                                <label htmlFor="category">Category</label>
                                                <input
                                                    id="category"
                                                    type="text"
                                                    name="category"
                                                    value={editForm.category}
                                                    onChange={(e) =>
                                                        setEditForm({ ...editForm, category: e.target.value })
                                                    }
                                                />
                                            </>
                                        ) : (
                                            key.category
                                        )}
                                    </td>

                                    <td className={styles.twoLines}>

                                        <button className={styles.editButton}
                                            onClick={() => {
                                                setEditingId(key.id);
                                                setEditForm({
                                                    date: key.date,
                                                    amount: String(key.amount),
                                                    category: key.category,
                                                });
                                            }}
                                        >
                                            Edit
                                        </button>
                                        {editingId === key.id && (
                                            <>

                                                <button onClick={() => saveEdit(key.id)} className={styles.saveEditButton}>
                                                    Save
                                                </button>
                                                <button onClick={() => setEditingId(null)} className={styles.cancelEditButton}>
                                                    Cancel
                                                </button>
                                            </>
                                        )}

                                        <button title="Are you sure?"
                                            className={styles.deleteButton}
                                            onClick={() => deletePayment(key.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div>

                    <h2 className={styles.showTotal}>Total: {total.toFixed(2)}</h2>
                </div>


            </div>
        </>
    );
}
