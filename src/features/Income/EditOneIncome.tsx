import { useEffect } from "react";
import { NavLink } from "react-router";



const apiUrl = `${import.meta.env.VITE_API_URL}/income`;

export function EditOneIncome() {

    useEffect(() => {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Request failed");
                }
                return response.json();
            })
            .catch(error => console.error(error))
            .then((data) => console.log(data));

    }, []);
    return (
        <>
            <h1>Edit</h1>


            <NavLink to="/income">

                <button>Back</button>
            </NavLink>
        </>
    )
}

