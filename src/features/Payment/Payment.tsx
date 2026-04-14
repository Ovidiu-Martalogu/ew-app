import { useEffect, useState } from "react";
import type { Payment, SortChoice } from "./types";

import styles from './Payment.module.css';

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
      

        if(!amount){
                alert("Please enter only values for amount"); 
        if (!date || !amount || !category) {
            alert("Please fill all the fields");
            
            }
            return;
        }
        const newPayment = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ date, amount: Number(amount), category, deleted: false }),
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

    async function checkForDeletePayment(payment: Payment) {

        const checkDeletePayment = {
            ...payment,
            deleted: !payment.deleted,
        };
        await fetch(`${apiUrl}/${payment.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ deleted: checkDeletePayment.deleted }),
        }).then((response) => response.json());


        // update local state
        setpayment((prev) =>
            prev
                ? prev.map((key) =>
                    key.id === payment.id ? checkDeletePayment : key
                )
                : prev
        );
    }
    async function deletePayment(id: number) {
        const item = payment?.find(key => key.id === id);

        if (item?.deleted !== true) {
            alert("If you want to delete, please mark the registration!");
            return;
        }
        await fetch(`${apiUrl}/${id}`, {
            method: "DELETE",
        });

        // update local state
        setpayment((prev) =>
            prev ? prev.filter((key) => key.id !== id) : prev
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
    if (!payment) {
        return (
            <>
                <strong>Wait....Loading payment...</strong>;
                {addPayment && (
                    <form onSubmit={addPaymentsToDB} className={styles.form}>
                        <input type="date" name="date" placeholder="date" />
                        <input type="number" name="amount" placeholder="amount" />
                        <input name="category" placeholder="category" />
                        <button type="submit" className={styles.addPaymentButton}>Add Payment</button>
                    </form>)}
            </>
        )
    }

    return (
        <>
            <h1 className={styles.title}>Payment</h1>

            {/* SORT BUTTONS */}
            <div className={styles.sortBar}>
                <button onClick={() => setSortField("date")}>
                    <label htmlFor="sort">
                        Sort by Date{" "}
                        <select
                            name="sort"
                            id="sort"
                            className={styles.selectAmount}
                            onChange={(e) => setSortChoice(e.target.value as SortChoice)}
                        >
                            <option value="ascending">Ascending</option>
                            <option value="descending">Descending</option>
                        </select>
                    </label>
                </button>

                <button onClick={() => setSortField("amount")}>
                    <label htmlFor="sortAmount">
                        Sort by Amount{" "}
                        <select
                            name="sortAmount"
                            id="sortAmount"
                            className={styles.selectAmount}
                            onChange={(e) => setSortChoice(e.target.value as SortChoice)}
                        >
                            <option value="ascending">Ascending</option>
                            <option value="descending">Descending</option>
                        </select>
                    </label>
                </button>
            </div>

            {/* TABLE */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Category</th>
                            <th>Edit</th>
                            <th>Select to delete</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedPayments.map((key) => (
                            <tr key={key.id}>
                              
                                <td>
                                    {editingId === key.id ? (
                                        <input
                                            type="date"
                                            value={editForm.date}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, date: e.target.value })
                                            }
                                        />
                                    ) : (
                                        key.date
                                    )}
                                </td>

                                <td>
                                    {editingId === key.id ? (
                                        <input
                                            type="text"
                                            value={editForm.amount}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, amount: e.target.value })
                                            }
                                        />
                                    ) : (
                                        key.amount
                                    )}
                                </td>

                                <td>
                                    {editingId === key.id ? (
                                        <input
                                            value={editForm.category}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, category: e.target.value })
                                            }
                                        />
                                    ) : (
                                        key.category
                                    )}
                                </td>

                                <td>

                                    {/* aici editButton */}
                                    <button
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

                                            <button onClick={() => saveEdit(key.id)}>
                                                Save
                                            </button>
                                            <button onClick={() => setEditingId(null)}>
                                                Cancel
                                            </button>
                                        </>
                                    )}

                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={key.deleted}
                                        onChange={() => checkForDeletePayment(key)}
                                    />
                                </td>

                                <td>
                                    <button
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

                <h2>Total: {total.toFixed(2)}</h2>
            </div>

            {/* FORM */}
            {addPayment && (
                <form onSubmit={addPaymentsToDB} className={styles.form}>
                    <label id="date">Select the date:
                        <input type="date" id="date" name="date" className={styles.input} />
                    </label>
                    <label id="amount"> Insert the amount:
                        <input type="text" name="amount" className={styles.input} />
                    </label>
                    <label id="category"> Insert the category:
                        <input name="category" className={styles.input} />
                    </label>
                    <button type="submit" className={styles.button}>
                        Add Payment
                    </button>
                </form>
            )}

            <button onClick={buttonAddPayment} className={styles.addPaymentButton}>
                {addPayment ? "Back" : "Add new Payment"}
            </button>
        </>
    );
}