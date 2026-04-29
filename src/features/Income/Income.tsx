import { useEffect, useState } from "react";
import type { Income, SortChoice } from "./types";
import styles from "./income.module.css";

const apiUrl = `${import.meta.env.VITE_API_URL}/income`;

export function getAuth() {
    try {
        const authRaw = localStorage.getItem("auth");
        if (!authRaw) return null;

        const result = JSON.parse(authRaw);

        return result?.user?.id ?? null;
    } catch (error) {
        console.error("Invalid auth in localStorage:", error);
        return null;
    }
}

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

    // NEW
    const [type, setType] = useState<"active" | "passive">("active");
    const [passiveIncome, setPassiveIncome] = useState<
        { source: string; amount: number }[]
    >([]);

    const buttonAddIncome = () => {
        setAddIncome(!addIncome);
    };

    useEffect(() => {
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => setIncome(data));
    }, []);

    async function addIncomeToDB(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!addIncome) return;

        const form = new FormData(e.currentTarget);
        const date = form.get("date");
        const amount = form.get("amount");
        const category = form.get("category");

        if (!amount) {
            alert("Please enter amount");
            return;
        }

        const userId = getAuth();

        if (!userId) {
            alert("User not logged in");
            return;
        }

        const newIncome = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date,
                amount,
                category: type === "active" ? category : undefined,
                passiveIncome: type === "passive" ? passiveIncome : undefined,
                type,
                deleted: false,
                userId,
            }),
        }).then((res) => res.json());

        setIncome([...(income ?? []), newIncome]);
        setAddIncome(false);
        setPassiveIncome([]);
        setType("active");
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
            prev ? prev.map((item) => (item.id === id ? data : item)) : prev
        );

        setEditingId(null);
    }

    async function deleteIncome(id: number) {
        const ok = window.confirm("Sigur vrei să ștergi?");
        if (!ok) return;

        await fetch(`${apiUrl}/${id}`, {
            method: "DELETE",
        });

        setIncome((prev) =>
            prev ? prev.filter((item) => item.id !== id) : prev
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
        <div className={styles.content}>
            <h1>income money</h1>

            <div className={styles.sortBar}>
                <button onClick={() => setSortField("date")}>
                    Sort by Date
                </button>

                <button onClick={() => setSortField("amount")}>
                    Sort by Amount
                </button>
            </div>

            <div className={styles.cardContainer}>
                {sortedIncome?.map((key) => (
                    <div
                        key={key.id}
                        className={styles.card}
                        style={{
                            borderLeft: `6px solid ${getCategoryColor(
                                key.category
                            )}`,
                        }}
                    >
                        {editingId === key.id ? (
                            <>
                                <input
                                    type="date"
                                    value={editForm.date}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            date: e.target.value,
                                        })
                                    }
                                />

                                <input
                                    value={editForm.amount}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            amount: e.target.value,
                                        })
                                    }
                                />

                                <input
                                    value={editForm.category}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            category: e.target.value,
                                        })
                                    }
                                />
                            </>
                        ) : (
                            <>
                                <h3>
                                    {key.type === "passive"
                                        ? "Passive Income"
                                        : key.category}
                                </h3>

                                <p>
                                    <strong>Date:</strong> {key.date}
                                </p>

                                <p>
                                    <strong>Amount:</strong> {key.amount}
                                </p>
                            </>
                        )}

                        <div className={styles.cardActions}>
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

                            <button onClick={() => deleteIncome(key.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <h2>Total: {total.toFixed(2)}</h2>
            <div className={styles.form}>


                {addIncome && (
                    <form onSubmit={addIncomeToDB} className={styles.form}>
                        <label className={styles.labelBgn}>
                            Type:
                            <select
                                value={type}
                                onChange={(e) =>
                                    setType(e.target.value as "active" | "passive")
                                }
                            >
                                <option value="active">Active</option>
                                <option value="passive">Passive</option>
                            </select>
                        </label>

                        <label className={styles.labelBgn}>
                            Date:
                            <input type="date" name="date" />
                        </label>

                        <label className={styles.labelBgn}>
                            Amount:
                            <input type="text" name="amount" />
                        </label>

                        {type === "active" && (
                            <label className={styles.labelBgn}>
                                Category:
                                <input name="category" />
                            </label>
                        )}

                        {type === "passive" && (
                            <div>
                                <h4 className={styles.labelBgn}>Passive Income</h4>

                                {passiveIncome.map((item, index) => (
                                    <div key={index}>
                                        <input
                                            placeholder="source"
                                            value={item.source}
                                            onChange={(e) => {
                                                const copy = [...passiveIncome];
                                                copy[index].source =
                                                    e.target.value;
                                                setPassiveIncome(copy);
                                            }}
                                        />

                                        <input
                                            placeholder="amount"
                                            value={item.amount}
                                            onChange={(e) => {
                                                const copy = [...passiveIncome];
                                                copy[index].amount = Number(
                                                    e.target.value
                                                );
                                                setPassiveIncome(copy);
                                            }}
                                        />
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPassiveIncome([
                                            ...passiveIncome,
                                            { source: "", amount: 0 },
                                        ])
                                    }
                                >
                                    + Add source
                                </button>
                            </div>
                        )}

                        <button type="submit">Add Income</button>
                    </form>
                )}
            </div>
            <button onClick={buttonAddIncome}>
                {addIncome ? "Back" : "Add new Income"}
            </button>
        </div>
    );
}