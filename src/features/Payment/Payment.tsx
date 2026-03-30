import { useEffect, useState } from "react";
import type { Payment } from "./types";

import styles from './Payment.module.css';

const apiUrl = `${import.meta.env.VITE_API_URL}/payments`;

export function Payment() {
    const [payment, setpayment] = useState<Payment[] | null>(null);
    const [addPayment, setAddPayment] = useState(false);
    const [sortField, setSortField] = useState<"date" | "amount" | null>(null);
    const buttonAddMPayment = () => {
        setAddPayment(!addPayment);
    };

    useEffect(() => {
        fetch(apiUrl)
            .then((response) => response.json())

            .then((data) => setpayment(data));

        // console.log(setmovie(data));
    }, []);

    async function showPayment(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!addPayment) return;

        const form = e.target;
        const data = new FormData(form);
        const date = data.get("date");
        const amount = data.get("amount");
        const category = data.get("category");
        if (!date ||!amount || !category) {
            alert("Please fill all the rouds");
            return;
        }
        const newPayment = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ date, amount, category, deleted: false }),
        }).then((response) => response.json());

        setpayment([...(payment ?? []), newPayment]);
    }


    async function updatePayment(payment: Payment) {

        const updated = {
            ...payment,
            deleted: !payment.deleted,
        };
        await fetch(`${apiUrl}/${payment.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ deleted: updated.deleted }),
        }).then((response) => response.json());


        // update local state
        setpayment((prev) =>
            prev
                ? prev.map((key) =>
                    key.id === payment.id ? updated : key
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
    const sortedPayments = [...(payment ?? [])].sort((a, b) => {
        if (!sortField) return 0;

        if (sortField === "amount") {
            return Number(a.amount) - Number(b.amount);
        }

        if (sortField === "date") {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        }

        return 0;
    });
    if (!payment) {
        return (
            <>
                <strong>Wait....Loading payment...</strong>;
                {addPayment && (
                    <form onSubmit={showPayment} className={styles.form}>
                        <input type="date" name="date" placeholder="date" />
                        <input type="text" name="amount" placeholder="amount" />
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
                <button onClick={() => setSortField("date")}>Sort by Date</button>
                <button onClick={() => setSortField("amount")}>Sort by Amount</button>
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
                    </thead>F

                    <tbody>
                        {sortedPayments.map((key) => (
                            <tr key={key.id}>
                                <td>{key.date}</td>
                                <td>{key.amount}</td>
                                <td>{key.category}</td>
                                 <td>
                                    <button
                                        className={styles.editButton}
                                        onClick={() => deletePayment(key.id)}
                                    >
                                        Edit
                                    </button>
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={key.deleted}
                                        onChange={() => updatePayment(key)}
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

            {/* FORM */}
            {addPayment && (
                <form onSubmit={showPayment} className={styles.form}>
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

            <button onClick={buttonAddMPayment} className={styles.addPaymentButton}>
                {addPayment ? "Back" : "Add new Payment"}
            </button>
        </>
    );
}