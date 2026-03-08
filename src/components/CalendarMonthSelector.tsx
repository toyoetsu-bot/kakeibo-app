import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { addMonths, subMonths, format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

export function CalendarMonthSelector() {
    const { currentDate, setCurrentMonth } = useAppStore();
    const dateObj = parseISO(currentDate);

    const handlePrev = () => {
        setCurrentMonth(format(subMonths(dateObj, 1), 'yyyy-MM-dd'));
    };

    const handleNext = () => {
        setCurrentMonth(format(addMonths(dateObj, 1), 'yyyy-MM-dd'));
    };

    const handleDirectSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setCurrentMonth(`${e.target.value}-01`);
        }
    };

    return (
        <div className="flex items-center justify-between bg-splat-dark p-4 border-b-4 border-splat-black sticky top-0 z-40">
            <button
                onClick={handlePrev}
                className="p-2 bg-splat-pink text-white rounded-full splat-shadow-sm hover:scale-105 active:scale-95 transition-transform"
            >
                <ChevronLeft size={24} />
            </button>

            <div className="flex items-center gap-2 text-2xl font-bold font-splatoon tracking-wider relative group">
                <CalendarIcon size={24} className="text-splat-green" />
                <span>{format(dateObj, 'yyyy年 M月', { locale: ja })}</span>

                {/* Hidden input for direct tap month selection */}
                <input
                    type="month"
                    value={format(dateObj, 'yyyy-MM')}
                    onChange={handleDirectSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
            </div>

            <button
                onClick={handleNext}
                className="p-2 bg-splat-blue text-white rounded-full splat-shadow-sm hover:scale-105 active:scale-95 transition-transform"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
}
