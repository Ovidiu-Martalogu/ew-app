export type Income = {
    id: number;
    date: string;
    amount: number;
    category: string;
    deleted: boolean;
    salariu:string;
    bonus:string;
    comision:string;
    imprumut:string
}

export type SortChoice = "ascending" | "descending";