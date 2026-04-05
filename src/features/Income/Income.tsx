import { useEffect, useState } from "react";
import type { Income } from "./types";

import styles from './income.module.css';

const apiUrl = `${import.meta.env.VITE_API_URL}/income`;

export function Income() {
    const [income, setIncome] = useState<Income[] | null>(null);



    useEffect(() => {
        fetch(apiUrl)
            .then((response) => response.json())

            .then((data) => setIncome(data));

        console.log(income);
    }, []);
    return (

        <h1>income money</h1>
    )

}