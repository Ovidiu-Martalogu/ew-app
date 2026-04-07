export type Income = {
    id: number;
    date: string;
    amount: number;
    category: string;
    deleted: boolean
}

export type SortChoice = "ascending" | "descending";