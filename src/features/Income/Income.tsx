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
        const type = form.get("type");
        const details = form.get("details")

        if (!date) return (console.log(`not date`))
        if (!amount) return (console.log(`not`))
        if (!category) return (console.log(`not cat`))

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
                category,
                type:type === "active" ? type : "active",
                deleted: false,
                userId,
                details
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
            active: "#9C27B0",
            passive: "#FF9800",
        };

        return colors[category?.toLowerCase() as keyof typeof colors] || "#607D8B";
    };

    return (
        <div className={styles.content}>
            <h1>income money</h1>

            <div >

                {addIncome && (
                    <form onSubmit={addIncomeToDB} className={styles.form}>
                        <label>
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
                         <label className={styles.labelBgn}>
                                Category:
                                <input name="category" />
                            </label>
                        <label className={styles.labelBgn}>
                            Details:
                            <input type="text" name="details" />
                        </label>


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

                        <button type="submit" className={styles.button}>Add Income</button>
                    </form>
                )}
            </div>
            <button onClick={buttonAddIncome} className={styles.addIncomeButton}>
                {addIncome ? "Back" : "Add new Income"}
            </button>


            <div className={styles.cardContainer}>
                {income?.map((item) => (
                    <div
                        key={item.id}
                        className={styles.card}
                        style={{
                            borderTop: `6px solid ${getCategoryColor(item.type)}`,
                        }}
                    >
                        <p>This is
                            <strong> {item.type} </strong>
                            income
                        </p>
                        <p>
                            <strong>Date:</strong> {item.date}
                        </p>
                        <p>
                            <strong>Amount:</strong> {item.amount}
                        </p>
                        <p>
                            <strong>category:</strong> {item.category}
                        </p>
                        <p>
                            <strong>details:</strong> {item.details}
                        </p>

                        <div className={styles.cardActions}>
                            <NavLink to={`/income/edit/${item.id}`} className={styles.editLink}>
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
        </div>
    );
}