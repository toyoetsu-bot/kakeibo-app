import React, { useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CalendarMonthSelector } from '../CalendarMonthSelector';
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    isSameMonth,
    isSameDay,
    parseISO
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { cn } from '../../utils/cn';

export function CalendarView() {
    const { currentDate, transactions, setSelectedDay, setTab } = useAppStore();
    const dateObj = parseISO(currentDate);

    // Generate calendar days (including padding for the first/last week)
    const days = useMemo(() => {
        const start = startOfWeek(startOfMonth(dateObj), { weekStartsOn: 0 }); // Sunday start
        const end = endOfWeek(endOfMonth(dateObj), { weekStartsOn: 0 });
        return eachDayOfInterval({ start, end });
    }, [dateObj]);

    const monthTransactions = useMemo(() => {
        return transactions.filter(t => isSameMonth(parseISO(t.date), dateObj));
    }, [transactions, dateObj]);

    const totalIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    const handleDaySelect = (day: Date) => {
        setSelectedDay(format(day, 'yyyy-MM-dd'));
        setTab('input');
    };

    return (
        <div className="flex flex-col h-full bg-splat-dark pb-24">
            <CalendarMonthSelector />

            {/* Month Summary Card */}
            <div className="p-4 mx-4 mt-4 bg-splat-black border-4 border-gray-700 rounded-2xl splat-shadow font-splatoon">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-[#1a1a1a] p-2 rounded-xl">
                        <div className="text-splat-blue text-sm">収入</div>
                        <div className="text-xl text-white font-bold">¥{totalIncome.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1a1a1a] p-2 rounded-xl">
                        <div className="text-splat-pink text-sm">支出</div>
                        <div className="text-xl text-white font-bold">¥{totalExpense.toLocaleString()}</div>
                    </div>
                </div>
                <div className="mt-4 p-2 bg-[#2a2a2a] rounded-xl text-center">
                    <div className="text-gray-400 text-sm">収支バランス</div>
                    <div className={cn(
                        "text-2xl font-bold font-splatoon",
                        balance >= 0 ? "text-splat-green" : "text-splat-pink"
                    )}>
                        {balance >= 0 ? '+' : ''}¥{balance.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4 flex-1">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 mb-2">
                    {['日', '月', '火', '水', '木', '金', '土'].map((d, i) => (
                        <div key={d} className={cn(
                            "text-center text-sm font-bold",
                            i === 0 ? "text-splat-pink" : i === 6 ? "text-splat-blue" : "text-gray-400"
                        )}>
                            {d}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {days.map(day => {
                        const dayStr = format(day, 'yyyy-MM-dd');
                        const dayTransactions = monthTransactions.filter(t => t.date === dayStr);
                        const dayIncome = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
                        const dayExpense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

                        const isCurrentMonth = isSameMonth(day, dateObj);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <button
                                key={dayStr}
                                onClick={() => handleDaySelect(day)}
                                className={cn(
                                    "flex flex-col h-[70px] p-1 border-2 rounded-xl transition-transform active:scale-95",
                                    isCurrentMonth ? "bg-splat-black border-gray-800 hover:border-splat-yellow" : "bg-transparent border-transparent opacity-30",
                                    isToday && "border-splat-yellow bg-[#222]" // highlight today
                                )}
                            >
                                <div className={cn(
                                    "text-xs font-bold text-left px-1",
                                    isToday ? "text-splat-yellow" : "text-gray-300"
                                )}>
                                    {format(day, 'd')}
                                </div>

                                <div className="flex flex-col mt-auto text-[10px] sm:text-xs font-bold text-right leading-tight">
                                    {dayIncome > 0 && <div className="text-splat-blue truncate">+ {dayIncome}</div>}
                                    {dayExpense > 0 && <div className="text-splat-pink truncate">- {dayExpense}</div>}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
