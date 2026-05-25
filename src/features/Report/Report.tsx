
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
import { getAuth } from '../../hooks/getUserFromLocalStorage';

const apiUrl = `${import.meta.env.VITE_API_URL}/payments`;

const apiUrlIncome = `${import.meta.env.VITE_API_URL}/income`;

type IncomeItem = {
    id: number;
    userId: number;
    date: string;
    amount: number;
};

type PaymentItem = {
    id: number;
    userId: number;
    date: string;
    amount: number;
};

type ChartData = {
    date: string;
    income: number;
    payments: number;
};

function getAuthHeaders(): HeadersInit {
    const auth = getAuth();

    return {
        "Content-Type": "application/json",
        ...(auth?.accessToken
            ? { Authorization: `Bearer ${auth.accessToken}` }
            : {}),
    };
}

export function Report() {
    const [data, setData] = useState<ChartData[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const auth = getAuth();

                const userId = auth?.user?.id;

                if (!userId) {
                    console.error("User not found");
                    return;
                }

                const [incomeRes, paymentsRes] = await Promise.all([
                    fetch(`${apiUrlIncome}?userId=${userId}`, {
                        headers: getAuthHeaders(),
                    }),

                    fetch(`${apiUrl}?userId=${userId}`, {
                        headers: getAuthHeaders(),
                    }),
                ]);

                const income: IncomeItem[] = await incomeRes.json();

                const payments: PaymentItem[] =
                    await paymentsRes.json();

                const allDates = [
                    ...income.map((i) => i.date),
                    ...payments.map((p) => p.date),
                ];

                const uniqueDates = [...new Set(allDates)].sort();

                const merged: ChartData[] = uniqueDates.map((date) => {
                    const incomeTotal = income
                        .filter((i) => i.date === date)
                        .reduce(
                            (sum, item) => sum + item.amount,
                            0
                        );

                    const paymentsTotal = payments
                        .filter((p) => p.date === date)
                        .reduce(
                            (sum, item) => sum + item.amount,
                            0
                        );

                    return {
                        date,
                        income: incomeTotal,
                        payments: paymentsTotal,
                    };
                });

                setData(merged);

            } catch (error) {
                console.error("Failed to load data:", error);
            }
        };

        loadData();
    }, []);

    return (
        <div className={styles.content}>
            <h1>Report page</h1>
            <h3>Page under development.......</h3>
            <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="date" />

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
    );
}