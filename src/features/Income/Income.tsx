import { useEffect, useState } from "react";
import type { Income } from "./types";
import styles from "./income.module.css";
import { NavLink, } from "react-router";
import { getAuth } from "../../hooks/getUserFromLocalStorage";

const apiUrl = `${import.meta.env.VITE_API_URL}/income`;


export function Income() {
    const [income, setIncome] = useState<Income[] | null>(null);
    const [addIncome, setAddIncome] = useState(false);
    const [type, setType] = useState<"active" | "passive">("active");

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
                type: type === "active" ? type : "active",
                deleted: false,
                userId,
                details
            }),
        }).then((res) => res.json());

        setIncome([...(income ?? []), newIncome]);
        setAddIncome(false);

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



    if (!income || income.length === 0) {

        return (
            <>
                <h1 className={styles.notIncomeMsg}>
                    <strong>You don't have any incomes. Please add .</strong>
                </h1>

                <div >

                    {addIncome && (
                        <form onSubmit={addIncomeToDB} className={styles.formAddIncome}>
                            <div className={styles.formGroup}>
                                <label htmlFor="type"> Type:</label>
                                <select
                                    id="type"
                                    value={type}
                                    onChange={(e) =>
                                        setType(e.target.value as "active" | "passive")
                                    }
                                >
                                    <option value="active">Active</option>
                                    <option value="passive">Passive</option>
                                </select>

                            </div>
                            <div className={styles.formGroup}>

                                <label htmlFor="date">  Date: </label>
                                <input
                                    id="date"
                                    type="date"
                                    name="date"
                                    className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>

                                <label htmlFor="amount">Amount:</label>
                                <input
                                    id="amount"
                                    type="number"
                                    name="amount"
                                    className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>

                                <label htmlFor="category">Category:</label>
                                <input
                                    id="category"
                                    type="text"
                                    name="category"
                                    className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="details">Details:</label>
                                <input
                                    id="details"
                                    type="text"
                                    name="details"
                                    className={styles.input} />
                            </div>


                            <button type="submit" className={styles.addIncomeButton}>Add Income</button>
                        </form>
                    )}
                    <button onClick={buttonAddIncome} className={styles.addIncomeButton}>
                        {addIncome ? "Back" : "Add new Income"}
                    </button>
                </div>
            </>
        )
    }



    return (
        <div className={styles.content}>
            <h1>income money</h1>

            <div >

                {addIncome && (
                    <form onSubmit={addIncomeToDB} className={styles.formAddIncome}>
                        <div className={styles.formGroup}>
                            <label htmlFor="type"> Type:</label>
                            <select
                                id="type"
                                value={type}
                                onChange={(e) =>
                                    setType(e.target.value as "active" | "passive")
                                }
                            >
                                <option value="active">Active</option>
                                <option value="passive">Passive</option>
                            </select>

                        </div>
                        <div className={styles.formGroup}>

                            <label htmlFor="date">  Date: </label>
                            <input
                                id="date"
                                type="date"
                                name="date"
                                className={styles.input} />
                        </div>

                        <div className={styles.formGroup}>

                            <label htmlFor="amount">Amount:</label>
                            <input
                                id="amount"
                                type="number"
                                name="amount"
                                className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>

                            <label htmlFor="category">Category:</label>
                            <input
                                id="category"
                                type="text"
                                name="category"
                                className={styles.input} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="details">Details:</label>
                            <input
                                id="details"
                                type="text"
                                name="details"
                                className={styles.input} />
                        </div>


                        <button type="submit" className={styles.addIncomeButton}>Add Income</button>
                    </form>
                )}
                <button onClick={buttonAddIncome} className={styles.addIncomeButton}>
                    {addIncome ? "Back" : "Add new Income"}
                </button>
            </div>
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
            <h2 className={styles.showTotal}>Total: {total?.toFixed(2)}</h2>
        </div>
    );
}