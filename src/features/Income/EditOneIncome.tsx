import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import styles from "../Income/EditOneIncome.module.css";


const apiUrl = `${import.meta.env.VITE_API_URL}/income`;

type Passive = {
    id: number;
    userId: number;
    date: string;
    amount: number;
    deleted: boolean;
    type: string;
    category?: string;
    details:string
};

type Income = {
    id: number;
    userId: number;
    date: string;
    amount: number;
    deleted: boolean;
    type: string;
    category?: string;
    details:string
  
};

export function EditOneIncome() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        date: "",
        amount: "",
        type: "",
        category: "",
        details:""
    });

              

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (!id) return;

        setLoading(true);

        fetch(`${apiUrl}/${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch income");
                }
                return res.json();
            })
            .then((data: Income) => {
                setForm({
                    date: data.date,
                    amount: String(data.amount),
                    category: data.category,
                    type: data.type,
                                 });
            })
            .catch(err => {
                console.error(err);
            })
          
    }, [id]);

    //my validateField

    function validateField(name: string, value: string) {
        if (!value || value.trim() === "") {
            return ` Please complete the ${name} field`;
        }

        if (name === "amount") {
            if (isNaN(Number(value))) {
                return "Amount must be a number";
            }
            if (Number(value) <= 0) {
                return "The sum must be positive";
            }
        }

        return "";
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        if (name === "status") {
            if (value === "active") {
                setForm(prev => ({
                    ...prev,
                    status: value,
                    passiveIncome: [],
                }));
            } else {
                setForm(prev => ({
                    ...prev,
                    status: value,
                    category: "",
                }));
            }
            return;
        }

        setForm(prev => ({ ...prev, [name]: value }));

        const errorMessage = validateField(name, value);

        setErrors((prev) => ({
            ...prev,
            [name]: errorMessage,
        }));
    }


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!id) return;

        await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date: form.date,
                amount: Number(form.amount),
                type: form.type,
                deleted: false,

                ...(form.type === "active" && {
                    category: form.category,
                }),

            
            }),
        });

        navigate("/income");
    }

    if (loading) return <p>Loading...</p>;

    return (
        <>

        <div className={styles.content}>
            <h1>Edit Income</h1>

            <form onSubmit={handleSubmit} className={styles.card}>
                {/* DATE */}
                <div>
                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                    />
                    {errors.date && <p style={{ color: "red" }}>{errors.date}</p>}
                </div>


                <div>
                    <label>Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                    />
                    {errors.amount && <p style={{ color: "red" }}>{errors.amount}</p>}
                </div>

                <div>
                    <label>type</label>
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                    >
                        <option value="active">Active</option>
                        <option value="passive">Passive</option>
                    </select>
                </div>


                {form.type === "active" && (
                    <div>
                        <label>Category</label>
                        <input
                            type="text"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                        />
                        {errors.category && <p style={{ color: "red" }}>{errors.category}</p>}
                    </div>
                )}


                {form.type === "passive" && (
                    <div>
                        <label>Passive Income</label>

                        {form.passiveIncome.map((p, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    placeholder="source"
                                    value={p.source}
                                    onChange={(e) => {
                                        const updated = [...form.passiveIncome];
                                        updated[index].source = e.target.value;
                                        setForm(prev => ({
                                            ...prev,
                                            passiveIncome: updated,
                                        }));
                                    }}
                                />
                                {errors.source && <p style={{ color: "red" }}>{errors.source}</p>}
                                <input
                                    type="number"
                                    placeholder="amount"
                                    value={p.amount}
                                    onChange={(e) => {
                                        const updated = [...form.passiveIncome];
                                        updated[index].amount = Number(e.target.value);
                                        setForm(prev => ({
                                            ...prev,
                                            passiveIncome: updated,
                                        }));
                                    }}
                                />
                                {errors.amount && <p style={{ color: "red" }}>{errors.amount}</p>}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() =>
                                setForm(prev => ({
                                    ...prev,
                                    passiveIncome: [
                                        ...prev.passiveIncome,
                                        { source: "", amount: 0 },
                                    ],
                                }))
                            }
                        >
                            + Add source
                        </button>
                    </div>
                )}

                <button type="submit">Update</button>
            </form>

            <NavLink to="/income">Back</NavLink>
            </div>
        </>
    );
}