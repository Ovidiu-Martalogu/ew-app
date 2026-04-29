import { useEffect, useState } from "react"
import styles from "../First-page/EditFirstPage.module.css";


const apiFirstPage = `${import.meta.env.VITE_API_URL}/firstpage`;


type CardContent = {
    cardTitle: string;
    cardSubtitle: string;
};

type Card = {
    title: string;
    subtitle: string;
    sectionTitle: string;
    card1: CardContent;
    card2: CardContent;
    card3: CardContent;
    footerTitle: string;
    footerSubtitle: string;
};

export function EditFirstPage() {
    const [firstPage, setFirstPage] = useState<Card[]>([]);

    useEffect(() => {
        fetch(apiFirstPage)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Request failed");
                }
                return response.json();
            })
            .then((data) => setFirstPage(data))
            .catch(error => console.error(error));
        //  .then((data)=>console.log((data)))
    }, []);

    if (!firstPage.length) return <p>Loading...</p>;

    return (
        <>
            <div className={styles.content1}>
                <h1>Edit</h1>
                <section className={styles.titleAndFooter}>
                    {firstPage.map((firstP, i) =>
                    (
                        <div key={i}>
                            <div>

                                <label htmlFor="title">
                                    <textarea className={styles.editTitle}
                                        name="title"
                                        id="title"
                                        placeholder="title to change"
                                        defaultValue={firstP.title} />
                                </label>
                            </div>
                            <div>
                                <label htmlFor="subtitle">
                                    <textarea className={styles.editSubTitle}
                                        name="subtitle"
                                        id="subtitle"
                                        placeholder="subtitle to change"
                                        defaultValue={firstP.subtitle} />
                                </label>
                            </div>

                        </div>
                    ))}
                </section>
                <section className={styles.sectionCards}>
                    {firstPage.map((firstP, i) => (
                        <div key={i}>

                            <div>
                                <label htmlFor="sectionTitle">
                                    <textarea className={styles.sectionTitle}
                                        name="sectionTitle"
                                        id="sectionTitle"
                                        placeholder="sectionTitle to change"
                                        defaultValue={firstP.sectionTitle} />
                                </label>
                            </div>
                        </div>
                    ))}
                    <div className={styles.grid}>
                        <div className={styles.card}>


                            {firstPage.map((card, i) => (
                                <div key={i}>

                                    <div>
                                        <label htmlFor="cardTitle">
                                            <textarea className={styles.sectionCardTitle}
                                                name="cardTitle"
                                                id="cardTitle"
                                                placeholder="sectionTitle to change"
                                                defaultValue={card.card1.cardTitle} />
                                        </label>
                                    </div>

                                    <div>
                                        <label htmlFor="cardSubtitle">
                                            <textarea className={styles.sectionTitle}
                                                name="cardSubtitle"
                                                id="cardSubtitle"
                                                placeholder="sectionTitle to change"
                                                defaultValue={card.card1.cardSubtitle} />
                                        </label>
                                    </div>
                                </div>

                            ))}
                        </div>

                        <div className={styles.card}>


                            {firstPage.map((card, i) => (
                                <div key={i}>
                                    <div>
                                        <label htmlFor="cardTitle2">
                                            <textarea className={styles.sectionTitle}
                                                name="cardTitle2"
                                                id="cardTitle2"
                                                placeholder="sectionTitle to change"
                                                defaultValue={card.card2.cardTitle} />
                                        </label>
                                    </div>

                                    <div>
                                        <label htmlFor="cardSubtitle2">
                                            <textarea className={styles.sectionTitle}
                                                name="cardSubtitle2"
                                                id="cardSubtitle2"
                                                placeholder="sectionTitle to change"
                                                defaultValue={card.card2.cardSubtitle} />
                                        </label>
                                    </div>
                                </div>

                            ))}
                        </div>

                        <div className={styles.card}>


                            {firstPage.map((card, i) => (
                                <div key={i}>
                                    <div>
                                        <label htmlFor="cardTitle3">
                                            <textarea className={styles.sectionTitle}
                                                name="cardTitle3"
                                                id="cardTitle3"
                                                placeholder="sectionTitle to change"
                                                defaultValue={card.card3.cardTitle} />
                                        </label>
                                    </div>

                                    <div>
                                        <label htmlFor="cardSubtitle3">
                                            <textarea className={styles.sectionTitle}
                                                name="cardSubtitle3"
                                                id="cardSubtitle3"
                                                placeholder="sectionTitle to change"
                                                defaultValue={card.card3.cardSubtitle} />
                                        </label>
                                    </div>
                                </div>

                            ))}
                        </div>

                    </div>
                </section>

                <section className={styles.titleAndFooter}>
                    {firstPage.map((firstF, i) => (
                        <div key={i}>
                            <h3>{firstF.footerTitle}</h3>
                            <p>{firstF.footerSubtitle}</p>

                        </div>
                    ))}

                </section>

            </div>

        </>
    )
}