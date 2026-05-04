import { useEffect, useState } from "react";
import type { Payment, SortChoice } from "./types";

import styles from './Payment.module.css';
import { getAuth } from "../../hooks/getUserFromLocalStorage";

const apiUrl = `${import.meta.env.VITE_API_URL}/payments`;


export function Payment() {
    const [payment, setpayment] = useState<Payment[] | null>(null);
    const [addPayment, setAddPayment] = useState(false);
    const [sortField, setSortField] = useState<"date" | "amount" | null>(null);
    const [sortChoice, setSortChoice] = useState<SortChoice>("ascending");

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({
        date: "",
        amount: "",
        category: "",
    });

    const buttonAddPayment = () => {
        setAddPayment(!addPayment);
    };
    //get Payment from DB
    useEffect(() => {
        fetch(apiUrl)
            .then((response) => response.json())

            .then((data) => setpayment(data));


    }, []);


    async function addPaymentsToDB(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!addPayment) return;

        const form = e.currentTarget;
        const data = new FormData(form);
        const date = data.get("date");
        const amount = Number(data.get("amount"));
        const category = data.get("category");


        if (!amount) {
            alert("Please enter only values for amount");
            if (!date || !amount || !category) {
                alert("Please fill all the fields");

            }
            return;

        }

        const userId = getAuth();

        if (!userId) {
            alert("User not logged in");
            return;
        }


        const newPayment = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date,
                amount: Number(amount),
                category,
                deleted: false,
                userId
            }),
        }).then((response) => response.json());

        setpayment([...(payment ?? []), newPayment]);
        setAddPayment(false);
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
    }
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


    if (!payment || payment.length === 0) {
        return (
            <>
                <h2 className={styles.notPaymentMsg}>
                    <strong>You don't have any payments. Please add payments.</strong>
                </h2>
                <div>

                    {addPayment && (
                        <form onSubmit={addPaymentsToDB} className={styles.formAddPayment}>

                            <div className={styles.formGroup}>
                                <label htmlFor="date">Select the date:</label>
                                <input
                                    id="date"
                                    type="date"
                                    name="date"
                                    className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="amount" > Insert the amount: </label>
                                <input
                                    id="amount"
                                    type="number"
                                    name="amount"
                                    className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>

                                <label htmlFor="category" > Insert the category:</label>
                                <input
                                    id="category"
                                    type="text"
                                    name="category"
                                    className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>


                                <button type="submit" className={styles.addPaymentButton}>
                                    Add Payment
                                </button>
                            </div>
                        </form>
                    )}

                    <button onClick={buttonAddPayment} className={styles.addPaymentButton}>
                        {addPayment ? "Back" : "Add new Payment"}
                    </button>
                </div>
            </>
        )
    }
    return (
        <>
            <div className={styles.content}>
                <h1 className={styles.title}>Payment</h1>


                <div>

                    {addPayment && (
                        <form onSubmit={addPaymentsToDB} className={styles.formAddPayment}>

                            <div className={styles.formGroup}>
                                <label htmlFor="date">Select the date:</label>
                                <input
                                    id="date"
                                    type="date"
                                    name="date"
                                    className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="amount" > Insert the amount: </label>
                                <input
                                    id="amount"
                                    type="number"
                                    name="amount"
                                    className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>

                                <label htmlFor="category" > Insert the category:</label>
                                <input
                                    id="category"
                                    type="text"
                                    name="category"
                                    className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>


                                <button type="submit" className={styles.addPaymentButton}>
                                    Add Payment
                                </button>
                            </div>
                        </form>
                    )}

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