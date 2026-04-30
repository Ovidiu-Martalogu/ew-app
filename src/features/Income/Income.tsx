import { useEffect, useState } from "react";
import type { Income } from "./types";
import styles from "./income.module.css";
import { NavLink, } from "react-router";


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

        if (!amount || !category || !date) {
            alert("Please feel all ");
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


    async function deleteIncome(id: number) {
        const ok = window.confirm("Are you sure?");
        if (!ok) return;

        await fetch(`${apiUrl}/${id}`, {
            method: "DELETE",
        });

        setIncome((prev) =>
            prev ? prev.filter((item) => item.id !== id) : prev
        );
    }


    const total = income?.reduce((sum, p) => {
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

            <div className={styles.cardContainer}>
                {income?.map((item) => (
                    <div
                        key={item.id}
                        className={styles.card}
                        style={{
                            borderLeft: `6px solid ${getCategoryColor(item.category)}`,
                        }}
                    >
                        <p>
                            <strong>Date:</strong> {item.date}
                        </p>

                        <p>
                            <strong>Amount:</strong> {item.amount}
                        </p>
                        <p>
                            <strong>category:</strong> {item.category}
                        </p>
                        {item.passiveIncome?.map((p, index) => (
                            <div key={index}>
                                <p>
                                    <strong>Source:</strong> {p.source}
                                </p>
                                <p>
                                    <strong>Amount:</strong> {p.amount}
                                </p>
                            </div>
                        ))}

                        <div className={styles.cardActions}>
                            <NavLink to={`/income/edit/${item.id}`}>
                                Edit
                            </NavLink>

                            <button onClick={() => deleteIncome(item.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <h2>Total: {total?.toFixed(2)}</h2>
            <div className={styles.addIncome}>


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