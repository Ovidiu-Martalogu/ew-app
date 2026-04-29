import { useEffect, useState } from "react";
import { NavLink } from "react-router";



const apiUrl = `${import.meta.env.VITE_API_URL}/income`;

type passive = {
    source: string;
    amount: number
}

type oneIncome = {
    amount: number;
    category: string;
    status: string;
    deleted: boolean;
    id: number;
    date: Date;
    userId: number;
    passiveIncome: passive

}


export function EditOneIncome() {
    const [oneIncome, setOneIncome] = useState<oneIncome[]>([])
    useEffect(() => {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Request failed");
                }
                return response.json();
            })
            .then((data) => setOneIncome(data))
            .catch(error => console.error(error))



    }, []);
    return (
        <>
            <h1>Edit</h1>

            {oneIncome.map((key, i) => (
                <div key={i}>
                    <p>Category: {key.category}</p>
                    <p>Status:{key.status}</p>
                    <p>Date:{key.date}</p>
                    <p>Amount:{key.amount}</p>

                </div>
            ))}
            {oneIncome && (
                <form>
                    <div >
                        <label htmlFor="status">Status</label>
                        <input
                            type="text"
                            id="status"
                            name="status"
                            defaultValue={oneIncome[0].status}
                        />
                    </div>
                    <button type="submit">Update</button>
                    <NavLink to="/income">

                        <button>Back</button>
                    </NavLink>
                </form>
            )}

        </>
    )
}

