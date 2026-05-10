
'use client';
import { useEffect, useState } from 'react';

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import styles from "../Report/Report.module.css"

const apiUrl = `${import.meta.env.VITE_API_URL}/payments`;

const apiUrlIncome = `${import.meta.env.VITE_API_URL}/income`;


type IncomeItem = {
    date: string;
    amount: number;
};

type PaymentItem = {
    date: string;
    amount: number;
};

type ChartData = {
    date: string;
    income: number;
    payments: number;
};

export function Report() {

    const [data, setData] = useState<ChartData[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const [incomeRes, paymentsRes] = await Promise.all([
                fetch(apiUrlIncome),
                fetch(apiUrl),
            ]);

            const income: IncomeItem[] = await incomeRes.json();
            const payments: PaymentItem[] = await paymentsRes.json();

            const merged: ChartData[] = income.map((item, index) => ({
                date: item.date,
                income: item.amount,
                payments: payments[index]?.amount || 0,
            }));

            setData(merged);
        };

        loadData();
    }, []);

    return (

        <>
            <div className={styles.content}>


                <h1>Report page</h1>
                <h3>Page under development.......</h3>
         

            <div className={styles.chartWrappe}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#22c55e"
                            strokeWidth={3}
                        />

                        <Line
                            type="monotone"
                            dataKey="payments"
                            stroke="#ef4444"
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
               </div>
        </>
    );
}