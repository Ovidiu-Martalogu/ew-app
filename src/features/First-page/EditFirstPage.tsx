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
    const [firstPage, setFirstPage] = useState<Card | null>(null);

    useEffect(() => {
        fetch(apiFirstPage)
            .then((res) => res.json())
            .then((data) => setFirstPage(data[0])); 
    }, []);

    if (!firstPage) return <p>Loading...</p>;

    const save = async () => {
        await fetch(`${apiFirstPage}/1`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(firstPage),
        });
    };

    return (
        <>
            <div className={styles.content1}>
                <h1>Edit</h1>
                <h3>Page under development.......</h3>

                <section className={styles.titleAndFooter}>
                    <div>
                        <label htmlFor="title">
                            <textarea
                                className={styles.editTitle}
                                id="title"
                                value={firstPage.title}
                                onChange={(e) =>
                                    setFirstPage({ ...firstPage, title: e.target.value })
                                }
                            />
                        </label>
                    </div>

                    <div>
                        <label htmlFor="subtitle">
                            <textarea
                                className={styles.editSubTitle}
                                id="subtitle"
                                value={firstPage.subtitle}
                                onChange={(e) =>
                                    setFirstPage({ ...firstPage, subtitle: e.target.value })
                                }
                            />
                        </label>
                    </div>
                </section>

                <section className={styles.sectionCards}>
                    <div>
                        <label htmlFor="sectionTitle">
                            <textarea
                                className={styles.sectionTitle}
                                id="sectionTitle"
                                value={firstPage.sectionTitle}
                                onChange={(e) =>
                                    setFirstPage({
                                        ...firstPage,
                                        sectionTitle: e.target.value,
                                    })
                                }
                            />
                        </label>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <textarea
                                className={styles.sectionCardTitle}
                                value={firstPage.card1.cardTitle}
                                onChange={(e) =>
                                    setFirstPage({
                                        ...firstPage,
                                        card1: {
                                            ...firstPage.card1,
                                            cardTitle: e.target.value,
                                        },
                                    })
                                }
                            />

                            <textarea
                                className={styles.sectionTitle}
                                value={firstPage.card1.cardSubtitle}
                                onChange={(e) =>
                                    setFirstPage({
                                        ...firstPage,
                                        card1: {
                                            ...firstPage.card1,
                                            cardSubtitle: e.target.value,
                                        },
                                    })
                                }
                            />
                        </div>

                        <div className={styles.card}>
                            <textarea
                                className={styles.sectionTitle}
                                value={firstPage.card2.cardTitle}
                                onChange={(e) =>
                                    setFirstPage({
                                        ...firstPage,
                                        card2: {
                                            ...firstPage.card2,
                                            cardTitle: e.target.value,
                                        },
                                    })
                                }
                            />

                            <textarea
                                className={styles.sectionTitle}
                                value={firstPage.card2.cardSubtitle}
                                onChange={(e) =>
                                    setFirstPage({
                                        ...firstPage,
                                        card2: {
                                            ...firstPage.card2,
                                            cardSubtitle: e.target.value,
                                        },
                                    })
                                }
                            />
                        </div>

                        <div className={styles.card}>
                            <textarea
                                className={styles.sectionTitle}
                                value={firstPage.card3.cardTitle}
                                onChange={(e) =>
                                    setFirstPage({
                                        ...firstPage,
                                        card3: {
                                            ...firstPage.card3,
                                            cardTitle: e.target.value,
                                        },
                                    })
                                }
                            />

                            <textarea
                                className={styles.sectionTitle}
                                value={firstPage.card3.cardSubtitle}
                                onChange={(e) =>
                                    setFirstPage({
                                        ...firstPage,
                                        card3: {
                                            ...firstPage.card3,
                                            cardSubtitle: e.target.value,
                                        },
                                    })
                                }
                            />
                        </div>
                    </div>
                </section>

                <section className={styles.titleAndFooter}>
                    <div>
                        <h3>{firstPage.footerTitle}</h3>

                        <textarea
                            className={styles.sectionTitle}
                            value={firstPage.footerSubtitle}
                            onChange={(e) =>
                                setFirstPage({
                                    ...firstPage,
                                    footerSubtitle: e.target.value,
                                })
                            }
                        />
                    </div>
                </section>

                <button onClick={save}>Save</button>
            </div>
        </>
    );
}