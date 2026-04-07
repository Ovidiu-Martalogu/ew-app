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

        const newIncome = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ date, amount, category, deleted: false }),
        }).then((response) => response.json());

        setAddIncome([...(income ?? []), newIncome]);
    }
    const sortedIncome = [...(income ?? [])].sort((a, b) => {
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
    const total = sortedIncome.reduce((sum, p) => {
        return sum + Number(p.amount);
    }, 0);

    const getCategoryColor = (category:string) => {
        const colors = {
            salariu: "#4CAF50",
            bonus: "#2196F3",
            comision: "#9C27B0",
            imprumut: "#FF9800",
        };

        return colors[category?.toLowerCase()] || "#607D8B";
    };


    return (
       
            <>
                <h1>income money</h1>

                <div className={styles.sortBar}>
                    <button onClick={() => setSortField("date")}>Sort by Date</button>
                    <button onClick={() => setSortField("amount")}>Sort by Amount</button>
                </div>

                <div className={styles.cardContainer}>
                    {income?.map((key) => (
                        <div
                            key={key.id}
                            className={styles.card}
                            style={{
                                borderLeft: `6px solid ${getCategoryColor(key.category)}`,
                            }}
                        >
                            <h3>{key.category}</h3>

                            <p>
                                <strong>Date:</strong> {key.date}
                            </p>

                            <p>
                                <strong>Amount:</strong> {key.amount}
                            </p>

                            <div className={styles.cardActions}>
                                <button onClick={() => handleEdit(key)}>Edit</button>
                                <button onClick={() => handleDelete(key.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <h2>Total: {total.toFixed(2)}</h2>
                </div>

                {/* FORM */}
                {addIncome && (
                    <form onSubmit={addIncomeToDB} className={styles.form}>
                        <label>
                            Select the date:
                            <input type="date" name="date" className={styles.input} />
                        </label>

                        <label>
                            Insert the amount:
                            <input type="text" name="amount" className={styles.input} />
                        </label>

                        <label>
                            Insert the category:
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

