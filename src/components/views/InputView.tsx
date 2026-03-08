import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { TransactionType } from '../../types';
import { Button } from '../ui/Button';
import { DynamicIcon } from '../../utils/icons';
import { format } from 'date-fns';
import { cn } from '../../utils/cn';
import { Plus, Trash2, X } from 'lucide-react';

export function InputView() {
    const {
        categories, addTransaction, selectedDay, setTab, addCategory,
        editingTransactionId, transactions, updateTransaction, deleteTransaction, setEditingTransactionId
    } = useAppStore();

    const editingTx = editingTransactionId ? transactions.find(t => t.id === editingTransactionId) : null;

    const [type, setType] = useState<TransactionType>(editingTx ? editingTx.type : 'expense');
    const [amount, setAmount] = useState(editingTx ? String(editingTx.amount) : '');
    const [date, setDate] = useState(editingTx ? editingTx.date : (selectedDay || format(new Date(), 'yyyy-MM-dd')));
    const [categoryId, setCategoryId] = useState<string>(editingTx ? editingTx.categoryId : '');
    const [memo, setMemo] = useState(editingTx ? (editingTx.memo || '') : '');
    const [isRecurring, setIsRecurring] = useState(editingTx ? !!editingTx.isRecurring : false);

    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCatName, setNewCatName] = useState('');

    const filteredCategories = categories.filter(c => c.type === type);

    // Auto-select first category if switched
    useEffect(() => {
        if (filteredCategories.length > 0 && !filteredCategories.find(c => c.id === categoryId)) {
            setCategoryId(filteredCategories[0].id);
        }
    }, [type, filteredCategories, categoryId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount))) return;
        if (!categoryId) return;

        const txData = {
            amount: Number(amount),
            date,
            categoryId,
            memo,
            type,
            isRecurring
        };

        if (editingTransactionId) {
            updateTransaction(editingTransactionId, txData);
            setEditingTransactionId(null);
        } else {
            addTransaction(txData);
        }

        // Reset and go back to calendar
        setAmount('');
        setMemo('');
        setTab('calendar');
    };

    const handleDelete = () => {
        if (editingTransactionId && window.confirm('本当に削除しますか？')) {
            deleteTransaction(editingTransactionId);
            setEditingTransactionId(null);
            setTab('calendar');
        }
    };

    const handleCancel = () => {
        setEditingTransactionId(null);
        setTab('calendar');
    };

    const handleAddCategory = () => {
        if (newCatName.trim()) {
            addCategory({
                name: newCatName.trim(),
                type,
                color: type === 'expense' ? '#ec1d7c' : '#8fd131',
                icon: 'Star' // Default icon for custom
            });
            setShowAddCategory(false);
            setNewCatName('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-splat-dark pb-24 font-splatoon overflow-y-auto">
            <div className="p-4 flex gap-4 bg-splat-black border-b-4 border-gray-800 sticky top-0 z-40">
                <button
                    onClick={() => setType('expense')}
                    className={cn(
                        "flex-1 py-3 text-xl font-bold rounded-xl transition-all splat-shadow",
                        type === 'expense'
                            ? "bg-splat-pink text-white scale-105"
                            : "bg-gray-800 text-gray-400"
                    )}
                >
                    支出
                </button>
                <button
                    onClick={() => setType('income')}
                    className={cn(
                        "flex-1 py-3 text-xl font-bold rounded-xl transition-all splat-shadow",
                        type === 'income'
                            ? "bg-splat-blue text-white scale-105"
                            : "bg-gray-800 text-gray-400"
                    )}
                >
                    収入
                </button>
            </div>

            {editingTransactionId && (
                <div className="px-4 pt-4 flex justify-between items-center">
                    <h2 className="text-splat-yellow font-bold text-lg">編集モード</h2>
                    <button onClick={handleCancel} className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                        <X size={20} /> キャンセル
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-4 space-y-6">

                {/* Date & Amount */}
                <div className="bg-[#1a1a1a] p-4 rounded-2xl splat-shadow border-2 border-gray-700 space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">日付</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-black text-white p-3 rounded-xl border border-gray-700 focus:border-splat-yellow outline-none text-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">金額 (円)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={cn(
                                "w-full bg-black text-white p-4 rounded-xl border-2 outline-none text-right font-bold text-3xl",
                                type === 'expense' ? "focus:border-splat-pink text-splat-pink" : "focus:border-splat-blue text-splat-blue"
                            )}
                            placeholder="0"
                            required
                        />
                    </div>
                </div>

                {/* Categories Grid */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm text-gray-400">カテゴリー</label>
                        <button
                            type="button"
                            onClick={() => setShowAddCategory(!showAddCategory)}
                            className="text-splat-yellow text-sm flex items-center bg-transparent"
                        >
                            <Plus size={16} /> 追加
                        </button>
                    </div>

                    {showAddCategory && (
                        <div className="flex gap-2 mb-4 animate-in fade-in">
                            <input
                                value={newCatName}
                                onChange={e => setNewCatName(e.target.value)}
                                placeholder="新しいカテゴリー名"
                                className="flex-1 bg-black text-white p-2 rounded border border-gray-700 outline-none"
                            />
                            <Button type="button" size="sm" variant="ink" onClick={handleAddCategory}>保存</Button>
                        </div>
                    )}

                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                        {filteredCategories.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setCategoryId(cat.id)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-transform active:scale-95",
                                    categoryId === cat.id
                                        ? `border-[${cat.color}] bg-[#222] scale-110 splat-shadow-sm`
                                        : "border-transparent bg-[#111] opacity-70 hover:opacity-100"
                                )}
                                style={categoryId === cat.id ? { borderColor: cat.color } : {}}
                            >
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center mb-1 bg-opacity-20"
                                    style={{ backgroundColor: `${cat.color}33`, color: cat.color }}
                                >
                                    <DynamicIcon name={cat.icon} size={20} />
                                </div>
                                <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                                    {cat.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Memo & Recurring */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">メモ</label>
                        <input
                            type="text"
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            className="w-full bg-[#1a1a1a] text-white p-3 rounded-xl border border-gray-700 focus:border-splat-yellow outline-none"
                            placeholder="何に使った？"
                        />
                    </div>

                    <label className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-gray-700 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={isRecurring}
                            onChange={(e) => setIsRecurring(e.target.checked)}
                            className="w-6 h-6 accent-splat-green rounded"
                        />
                        <span className="text-white font-bold text-sm">毎月繰り返す (固定費)</span>
                    </label>
                </div>

                {/* Submit / Actions */}
                <div className="mt-6 flex gap-3">
                    {editingTransactionId && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleDelete}
                            className="flex-shrink-0 !bg-red-900 !text-red-200 border-red-700 hover:!bg-red-800"
                        >
                            <Trash2 size={24} />
                        </Button>
                    )}
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        className="text-2xl tracking-widest flex-1"
                    >
                        {editingTransactionId ? '更新する !!' : (type === 'expense' ? '支 出' : '収 入') + ' 登録 !!'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
