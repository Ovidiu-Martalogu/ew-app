export type Income =
  | {
      id: number;
      userId: number;
      date: string;
      amount: number;
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
      deleted: boolean;
      type: "passive";
      passiveIncome: {
        source: string;
        amount: number;
      }[];
      category: never;
    };

