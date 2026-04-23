import { useEffect, useState } from "react"


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
            <h1>Edit first page</h1>
            <div>

                {firstPage.map((firstP, i) =>
                (
                    <div key={i}>
                        <div>
                            Up page

                            <h3>{firstP.title}</h3>
                            <h3>{firstP.subtitle}</h3>
                            <h3>{firstP.sectionTitle}</h3>
                        </div>
                        <div>Cards
                            <p>{firstP.card1.cardTitle}</p>
                            <p>{firstP.card1.cardSubtitle}</p>

                        </div>
                        <div>Footer
                            <p>{firstP.footerTitle}</p>
                            <p>{firstP.footerSubtitle}</p>

                        </div>
                        <div>
                            <form >
                <div>
                    <label htmlFor="title">Change title 
                        <input
                        type="text"
                        name="title"
                        id="title"
                        placeholder="title to change"
                        defaultValue={firstP.title} />
                    </label>
                </div>
            </form>
                        </div>

                    </div>
                ))}
            </div>
           
        </>
    )
}