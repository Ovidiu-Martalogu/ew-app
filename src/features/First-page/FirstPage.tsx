
import { useEffect, useState } from "react";
import styles from "./firstpage.module.css";


const apiUrl = `${import.meta.env.VITE_API_URL}/firstpage`;

type Card = {
    title: string;
    subtitle: string;
};

export function FirstPage() {

    const [firstPage, setFirstPage] = useState<Card[]>([]);


    useEffect(() => {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Request failed");
                }
                return response.json();
            })
            .then(data => setFirstPage(data))
            .catch(error => console.error(error));
    }, []);

    console.log(firstPage);



    if (!firstPage.length) return <p>Loading...</p>;


    return (
        <div className={styles.container}>
            {firstPage.map((card, i) => (
                <div key={i}>
                    <h3>{card.card1.cardTitle}</h3>
                    <p>{card.subtitle}</p>
                </div>
            ))}
        </div>
    );

}

