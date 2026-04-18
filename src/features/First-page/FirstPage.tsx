
import { useEffect, useState } from "react";
import styles from "./firstpage.module.css";


const apiUrl = `${import.meta.env.VITE_API_URL}/firstpage`;

type Card = {
    title: string;
    subtitle: string;
    sectionTitle: string;
    card1: string;
    card2: string;
    card3: string;
    footerTitle: string;
    footerSubtitle: string;

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

  
    if (!firstPage.length) return <p>Loading...</p>;


    return (
        <div className={styles.container}>
            <section className={styles.upAndDownText}>
                {firstPage.map((firstP, i) =>
                (
                    <div key={i}>
                        <h2 className={styles.title}>
                            {firstP.title}
                        </h2>
                        <p className={styles.subtitle}>
                            {firstP.subtitle}
                        </p>

                    </div>
                ))}
            </section>
            <section className={styles.sectionCards}>
                {firstPage.map((firstP, i) => (
                    <div key={i}>
                        <h3 className={styles.sectionTitle}>
                            {firstP.sectionTitle}
                        </h3>

                    </div>
                ))}
                <div className={styles.grid}>
                    <div className={styles.card}>


                        {firstPage.map((card, i) => (
                            <div key={i}>
                                <h4>{card.card1.cardTitle}</h4>
                                <p>{card.card1.cardSubtitle}</p>
                            </div>

                        ))}
                    </div>

                    <div className={styles.card}>


                        {firstPage.map((card, i) => (
                            <div key={i}>
                                <h4>{card.card2.cardTitle}</h4>
                                <p>{card.card2.cardSubtitle}</p>
                            </div>

                        ))}
                    </div>

                    <div className={styles.card}>


                        {firstPage.map((card, i) => (
                            <div key={i}>
                                <h4>{card.card3.cardTitle}</h4>
                                <p>{card.card3.cardSubtitle}</p>
                            </div>

                        ))}
                    </div>

                </div>
            </section>

            <section className={styles.upAndDownText}>
                {firstPage.map((firstF, i) => (
                    <div key={i}>
                        <h3>{firstF.footerTitle}</h3>
                        <p>{firstF.footerSubtitle}</p>

                    </div>
                ))}

            </section>

        </div>
    );

}

