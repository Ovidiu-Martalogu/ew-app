import { useEffect, useState } from "react";
import type { Income } from "./types";

import styles from './income.module.css';

const apiUrl = `${import.meta.env.VITE_API_URL}/income`;

export function Income() {
    const [income, setIncome] = useState<Income[] | null>(null);
    const [addIncome, setAddIncome] = useState(false);
    const [sortField, setSortField] = useState<"date" | "amount" | null>(null);
    const buttonAddIncome = () => {
        setAddIncome(!addIncome);
    };
    //get Income from DB
    useEffect(() => {
        fetch(apiUrl)
            .then((response) => response.json())

            .then((data) => setIncome(data));

    }, []);


    async function addIncomeToDB(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!addIncome) return;
        const form = new FormData(e.target);
        const date = form.get("date");
        const amount = form.get("amount");
        const category = form.get("category");

        if (!date || !amount || !category) {
            alert("Please fill all the rouds");
            return;
        }
    }

    return (
        <>
            <h1>income money</h1>
            <div className={styles.sortBar}>
                <button onClick={() => setSortField("date")}>Sort by Date</button>
                <button onClick={() => setSortField("amount")}>Sort by Amount</button>
            </div>

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
                        {income?.map((key) => (
                            <tr key={key.id}>
                                <td>{key.date}</td>
                                <td>{key.amount}</td>
                                <td>{key.category}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>


            {/* FORM */}
            {addIncome && (
                <form onSubmit={addIncomeToDB} className={styles.form}>
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
                        Add Income
                    </button>
                </form>
            )}

            <button onClick={buttonAddIncome} className={styles.addIncomeButton}>
                {addIncome ? "Back" : "Add new Income"}
            </button>
        </>
    )

}

