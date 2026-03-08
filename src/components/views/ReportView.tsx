import React, { useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CalendarMonthSelector } from '../CalendarMonthSelector';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { isSameMonth, parseISO, subMonths, format } from 'date-fns';
import { cn } from '../../utils/cn';

// Based on Japan University Co-op survey typical averages (monthly expense)
const COOP_AVERAGE = {
    '食費': 28000,
    '交通費': 4000,
    '交際費': 12000,
    '書籍・教材': 5000,
    '日用品': 6000
};

export function ReportView() {
    const { currentDate, transactions, categories, budgets } = useAppStore();
    const dateObj = parseISO(currentDate);

    // 1. Pie Chart Data (Expenses for current month)
    const monthExpenses = useMemo(() => {
        return transactions.filter(t => t.type === 'expense' && isSameMonth(parseISO(t.date), dateObj));
    }, [transactions, dateObj]);

    const pieData = useMemo(() => {
        const dataMap: Record<string, { name: string, value: number, color: string }> = {};
        monthExpenses.forEach(t => {
            const cat = categories.find(c => c.id === t.categoryId);
            if (!cat) return;
            if (!dataMap[cat.id]) {
                dataMap[cat.id] = { name: cat.name, value: 0, color: cat.color };
            }
            dataMap[cat.id].value += t.amount;
        });
        return Object.values(dataMap).sort((a, b) => b.value - a.value);
    }, [monthExpenses, categories]);

    // 2. Line Chart Data (Last 6 months trend for top 3 categories)
    const topCategories = pieData.slice(0, 3).map(d => d.name);

    const trendData = useMemo(() => {
        const data = [];
        for (let i = 5; i >= 0; i--) {
            const targetMonth = subMonths(dateObj, i);
            const monthStr = format(targetMonth, 'M月');
            const point: any = { name: monthStr };

            const monthTrans = transactions.filter(t =>
                t.type === 'expense' && isSameMonth(parseISO(t.date), targetMonth)
            );

            topCategories.forEach(catName => {
                const cat = categories.find(c => c.name === catName);
                if (cat) {
                    const sum = monthTrans.filter(t => t.categoryId === cat.id).reduce((s, t) => s + t.amount, 0);
                    point[cat.name] = sum;
                }
            });
            data.push(point);
        }
        return data;
    }, [dateObj, transactions, categories, topCategories]);

    // 3. Co-op Analysis
    const getAnalysisAdvice = () => {
        if (pieData.length === 0) return "まだ今月のデータがないイカ！どんどん記録しよう！(No data yet!)";

        let advice = "ナワバリバトルの調子はどう？\n";
        let isOverspending = false;

        pieData.forEach(d => {
            // @ts-ignore
            const avg = COOP_AVERAGE[d.name];
            if (avg && d.value > avg * 1.2) {
                advice += `⚠️ ${d.name}が大学生平均(${avg.toLocaleString()}円)よりかなり多いよ！\n`;
                isOverspending = true;
            }
        });

        if (!isOverspending) {
            advice += "素晴らしい！生協の学生平均より優秀な金銭感覚だ！この調子でイカよろしく！";
        } else {
            advice += "少し使いすぎカモ？来月は作戦を練り直そう！";
        }
        return advice;
    };

    return (
        <div className="flex flex-col h-full bg-splat-dark pb-24 font-splatoon overflow-y-auto">
            <CalendarMonthSelector />

            <div className="p-4 space-y-6">

                {/* Advice Box */}
                <div className="bg-splat-pink/20 border-2 border-splat-pink p-4 rounded-2xl splat-shadow-sm relative">
                    <div className="absolute -top-3 -left-2 bg-splat-pink text-white px-3 py-1 text-xs font-bold organic-shape transform -rotate-6">
                        ジャッジくんのアドバイス
                    </div>
                    <p className="text-white whitespace-pre-line mt-2 text-sm">
                        {getAnalysisAdvice()}
                    </p>
                </div>

                {/* Pie Chart */}
                <div className="bg-[#1a1a1a] p-4 rounded-2xl splat-shadow border-2 border-gray-700">
                    <h3 className="text-splat-yellow font-bold text-lg mb-2 text-center">今月の支出割合</h3>
                    {pieData.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="#1a1a1a" strokeWidth={3} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => `¥${value.toLocaleString()}`}
                                        contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '10px' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-10">データがありません</div>
                    )}
                </div>

                {/* Line Chart */}
                {trendData.length > 0 && topCategories.length > 0 && (
                    <div className="bg-[#1a1a1a] p-4 rounded-2xl splat-shadow border-2 border-gray-700 relative overflow-hidden">
                        {/* Background decorative splatter */}
                        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-splat-blue/10 animate-ink rounded-full organic-shape pointer-events-none" />

                        <h3 className="text-splat-blue font-bold text-lg mb-4 text-center">主要カテゴリーの月次推移</h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <XAxis dataKey="name" stroke="#666" fontSize={10} tickMargin={10} />
                                    <YAxis hide domain={['dataMin', 'auto']} />
                                    <Tooltip
                                        formatter={(value: number) => `¥${value.toLocaleString()}`}
                                        contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '10px' }}
                                    />
                                    {topCategories.map((catName, idx) => {
                                        const cat = categories.find(c => c.name === catName);
                                        return (
                                            <Line
                                                key={catName}
                                                type="monotone"
                                                dataKey={catName}
                                                stroke={cat?.color || '#fff'}
                                                strokeWidth={4}
                                                dot={{ r: 4, strokeWidth: 2 }}
                                                activeDot={{ r: 6 }}
                                            />
                                        );
                                    })}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
