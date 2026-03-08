import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { CalendarDays, PenTool, PieChart } from 'lucide-react';
import { cn } from '../utils/cn';

export function BottomNav() {
    const { currentTab, setTab } = useAppStore();

    const navItems = [
        { id: 'calendar', label: 'カレンダー', icon: <CalendarDays size={24} />, color: 'text-splat-blue', bg: 'bg-splat-blue' },
        { id: 'input', label: '入力', icon: <PenTool size={24} />, color: 'text-splat-pink', bg: 'bg-splat-pink' },
        { id: 'report', label: 'レポート', icon: <PieChart size={24} />, color: 'text-splat-yellow', bg: 'bg-splat-yellow' }
    ] as const;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-splat-dark border-t-4 border-splat-black z-50 flex justify-around items-center px-4">
            {navItems.map((item) => {
                const isActive = currentTab === item.id;

                return (
                    <button
                        key={item.id}
                        onClick={() => setTab(item.id)}
                        className={cn(
                            "relative flex flex-col items-center justify-center w-20 h-full transition-transform active:scale-95",
                            isActive ? "text-white" : "text-gray-400 hover:text-white"
                        )}
                    >
                        {/* Active BG Splatter Effect */}
                        {isActive && (
                            <div
                                className={cn(
                                    "absolute inset-0 m-auto w-16 h-16 rounded-full opacity-30 animate-ink organic-shape z-0",
                                    item.bg
                                )}
                            />
                        )}

                        <div className={cn("relative z-10", isActive && item.color)}>
                            {item.icon}
                        </div>
                        <span className={cn(
                            "text-[10px] uppercase font-bold mt-1 relative z-10 transition-colors",
                            isActive ? "text-white" : "text-gray-500"
                        )}>
                            {item.label}
                        </span>
                    </button>
                )
            })}
        </div>
    );
}
