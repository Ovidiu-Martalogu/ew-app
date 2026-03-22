import { useEffect, useState } from "react";
import type { Payment } from "./types";

import styles from './Payment.module.css';

const apiUrl = `${import.meta.env.VITE_API_URL}/payments`;

export function Payment() {

    const [payment, setpayment] = useState<Payment[] | null>(null);
    const [addPayment, setAddPayment] = useState(false);
    const toogleaddMPayment = () => {
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
                <strong>Loading payment...</strong>;
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

            <table className={styles.card}>
                <thead>
                    <tr>
                        <th>date</th>
                        <th>Amount</th>
                        <th>CategoryId</th>
                        <th>Delete payment?</th>
                        <th>Delete permanently</th>
                    </tr>
                </thead>
                <tbody>
                    {payment.map((key) => (
                        <tr key={key.id}>
                            <td>{key.date}</td>
                            <td>{key.amount}</td>
                            <td>{key.categoryId}</td>
                            <td className={styles.paymentItem}>{key.deleted ? "Yes" : "No"}
                                <label className={styles.paymentItem}>
                                    <input
                                        type="checkbox"
                                        checked={key.deleted}
                                        onChange={() => updatePayment(key)}
                                    />{" "}
                                </label>{" "}
                            </td>

                            <td>
                                <button className={styles.deleteButton} onClick={() => deletePayment(key.id)}>
                                    Delete
                                </button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
            {addPayment && (
                <form onSubmit={showPayment} className={styles.form}>
                    <input type="date" name="date" placeholder="date" />
                    <input type="text" name="amount" placeholder="amount" />
                    <input name="categoryId" placeholder="categoryId" />
                    <button type="submit" className={styles.button}>Add Payment</button>
                </form>
            )}
            <button onClick={toogleaddMPayment} className={styles.button}>
                {addPayment ? "Back" : "Add new Payment"}
            </button>

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