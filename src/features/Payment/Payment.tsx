import { useEffect, useState } from "react";
import type { Payment } from "./types";

import styles from './Payment.module.css';

const apiUrl = `${import.meta.env.VITE_API_URL}/payments`;

export function Payment() {

    const [payment, setpayment] = useState<Payment[] | null>(null);
    const [addPayment, setAddPayment] = useState(false);
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
        const categoryId = data.get("categoryId");

        const newPayment = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ date, amount, categoryId, deleted: false }),
        }).then((res) => res.json());

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
        const item = payment?.find(p => p.id === id);

        if (item?.deleted) {
            await fetch(`${apiUrl}/${id}`, {
                method: "DELETE",
            });
        }
        // update local state
        setpayment((prev) =>
            prev ? prev.filter((key) => key.id !== id) : prev
        );

    }

    if (!payment) {
        return (
            <>
                <strong>Wait....Loading payment...</strong>;
                {addPayment && (
                    <form onSubmit={showPayment} className={styles.form}>
                        <input type="date" name="date" placeholder="date" />
                        <input type="text" name="amount" placeholder="amount" />
                        <input name="categoryId" placeholder="categoryId" />
                        <button type="submit" className={styles.button}>Add Payment</button>
                    </form>)}
            </>
        )
    }
    return (
        <>
    <h1>Payment</h1>

    {/* CARD CONTAINER */}
    <div className={styles.card}>
        {payment.map((key) => (
            <div key={key.id} className={styles.cardItem}>
                
                <div data-label="Date">
                    Date: <span>{key.date}</span>
                </div>

                <div data-label="Amount">
                    Amount: <span>{key.amount}</span>
                </div>

                <div data-label="CategoryId">
                    CategoryId: <span>{key.categoryId}</span>
                </div>

                <div className={styles.paymentItem}>
                    Delete payment?
                    <span className={key.deleted ? styles.badgeRed : styles.badgeGreen}>
                        {key.deleted ? "Yes" : "No"}
                    </span>

                    <input
                        type="checkbox"
                        checked={key.deleted}
                        onChange={() => updatePayment(key)}
                    />
                </div>

                <div data-label="Actions">
                    <button
                        className={styles.deleteButton}
                        onClick={() => deletePayment(key.id)}
                    >
                        Delete
                    </button>
                </div>

            </div>
        ))}
    </div>

    {addPayment && (
        <form onSubmit={showPayment} className={styles.addPaymentButton}>
            <input type="date" name="date" placeholder="date" />
            <input type="text" name="amount" placeholder="amount" />
            <input name="categoryId" placeholder="categoryId" />

            <button type="submit" className={styles.button}>
                Add Payment
            </button>
        </form>
    )}

    <button onClick={buttonAddMPayment} className={styles.addPaymentButton}>
        {addPayment ? "Back" : "Add new Payment"}
    </button>

    {/* LISTA SIMPLĂ */}
    <div> 
        <ul>
            {payment.map((key) => (
                <li key={key.id}>
                    Date: {key.date} Amount {key.amount} CategoryId: {key.categoryId}
                </li>
            ))}
        </ul>
    </div>
</>
    );

}