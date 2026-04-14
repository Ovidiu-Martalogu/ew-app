import { useEffect, useState } from "react";
import type { Income, SortChoice } from "./types";

import styles from './income.module.css';

const apiUrl = `${import.meta.env.VITE_API_URL}/income`;

export function Income() {
    const [income, setIncome] = useState<Income[] | null>(null);
    const [addIncome, setAddIncome] = useState(false);
    const [sortField, setSortField] = useState<"date" | "amount" | null>(null);
    const [sortChoice, setSortChoice] = useState<SortChoice>("ascending");

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({
        date: "",
        amount: "",
        category: "",
    });

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

        if (!amount) {
            alert("Please enter only values for amount");
            if (!date || !amount || !category) {
                alert("Please fill all the fields");

            }
            return;
        }

        const newIncome = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ date, amount: Number(editForm.amount), category, deleted: false }),
        }).then((response) => response.json());

        setIncome([...(income ?? []), newIncome]);
        setAddIncome(false);
    }
    async function saveEdit(id: number) {
        const updated = {
            ...editForm,
            amount: Number(editForm.amount),
        };

        const res = await fetch(`${apiUrl}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updated),
        });

        const data = await res.json();

        setIncome((prev) =>
            prev
                ? prev.map((item) =>
                    item.id === id ? data : item
                )
                : prev
        );

        setEditingId(null);
    }
    async function checkForDelete(income: Income) {
        const checkDelete = {
            ...income,
            deleted: !income.deleted,
        };

        await fetch(`${apiUrl}/${income.id}`, {

            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ deleted: checkDelete.deleted }),
        }).then((response) => response.json());

        // update local state
        setIncome((prev) =>
            prev
                ? prev.map((key) =>
                    key.id === income.id ? checkDelete : key
                )
                : prev
        );
    }
    async function deleteIncome(id: number) {
        const item = income?.find(key => key.id === id);

        if (item?.deleted !== true) {
            alert("If you want to delete, please mark the registration!");
            return;
        }
        await fetch(`${apiUrl}/${id}`, {
            method: "DELETE",
        });

        // update local state
        setIncome((prev) =>
            prev ? prev.filter((key) => key.id !== id) : prev
        );

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

    const getCategoryColor = (category?: string) => {
        const colors = {
            salariu: "#4CAF50",
            bonus: "#2196F3",
            comision: "#9C27B0",
            imprumut: "#FF9800",
        };

        return colors[category?.toLowerCase() as keyof typeof colors] || "#607D8B";
    };

    return (

        <>
            <h1>income money</h1>

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

            <div className={styles.cardContainer}>
                {sortedIncome?.map((key) => (
                    <div
                        key={key.id}
                        className={styles.card}
                        style={{
                            borderLeft: `6px solid ${getCategoryColor(key.category)}`,
                        }}
                    >
                        {editingId === key.id ? (
                            <>
                                <input
                                    type="date"
                                    value={editForm.date}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, date: e.target.value })
                                    }
                                />

                                <input
                                    type="text"
                                    value={editForm.amount}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, amount: e.target.value })
                                    }
                                />

                                <input
                                    value={editForm.category}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, category: e.target.value })
                                    }
                                />
                            </>
                        ) : (
                            <>
                                <h3>{key.category}</h3>
                                <p><strong>Date:</strong> {key.date}</p>
                                <p><strong>Amount:</strong> {key.amount}</p>
                            </>
                        )}

                        <div className={styles.cardActions}>
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
                            <button onClick={() => checkForDelete(key)}>Check</button>
                            <input
                                type="checkbox"
                                checked={key.deleted}
                                onChange={() => checkForDelete(key)}
                            />
                            <button onClick={() => deleteIncome(key.id)}>Delete</button>
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

