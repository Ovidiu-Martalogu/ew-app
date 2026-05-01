export type Income =
  | {
    id: number;
    userId: number;
    date: string;
    amount: number;
    status: string;
    deleted: boolean;
    type: "active";
    category: string;
    passiveIncome?: never;
  }
  | {
    id: number;
    userId: number;
    date: string;
    amount: number;
    status: string;
    deleted: boolean;
    type: "passive";
    passiveIncome: {
      source: string;
      amount: number;
    }[];
    category: never;
  };

