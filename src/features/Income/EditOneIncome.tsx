import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router";

const apiUrl = `${import.meta.env.VITE_API_URL}/income`;

type Passive = {
    source: string;
    amount: number;
};

type Income = {
    id: number;
    userId: number;
    date: string;
    amount: number;
    deleted: boolean;
    status: string;
    category?: string;
    passiveIncome?: Passive[];
};

export function EditOneIncome() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        date: "",
        amount: "",
        category: "",
        status: "active",
        passiveIncome: [] as Passive[],
    });

    const [loading, setLoading] = useState(true);

    // 🔹 Fetch
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
                    category: data.category || "",
                    status: data.status,
                    passiveIncome: data.passiveIncome || [],
                });
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);


    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        // 🔥 reset logic când schimbi status
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
                status: form.status,
                deleted: false,

                ...(form.status === "active" && {
                    category: form.category,
                }),

                ...(form.status === "passive" && {
                    passiveIncome: form.passiveIncome,
                }),
            }),
        });

        navigate("/income");
    }

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <h1>Edit Income</h1>

            <form onSubmit={handleSubmit}>
                {/* DATE */}
                <div>
                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                    />
                </div>


                <div>
                    <label>Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Status</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="active">Active</option>
                        <option value="passive">Passive</option>
                    </select>
                </div>


                {form.status === "active" && (
                    <div>
                        <label>Category</label>
                        <input
                            type="text"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                        />
                    </div>
                )}


                {form.status === "passive" && (
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
        </>
    );
}