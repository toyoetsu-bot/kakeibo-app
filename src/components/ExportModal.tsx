import React, { useState } from 'react';
import { Button } from './ui/Button';
import { X } from 'lucide-react';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (startDate: string, endDate: string) => void;
}

export function ExportModal({ isOpen, onClose, onExport }: ExportModalProps) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    if (!isOpen) return null;

    const handleExport = () => {
        if (startDate && endDate) {
            onExport(startDate, endDate);
            onClose();
        } else {
            alert("開始日と終了日を選択してください");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] px-4">
            <div className="bg-splat-dark rounded-3xl p-6 w-full max-w-sm border-4 border-splat-yellow splat-shadow font-splatoon relative">
                <button
                    onClick={onClose}
                    className="absolute -top-4 -right-4 bg-splat-pink w-10 h-10 rounded-full flex items-center justify-center text-white border-2 border-splat-black splat-shadow-sm hover:scale-110 active:scale-95 transition-transform"
                >
                    <X size={20} />
                </button>

                <h3 className="text-xl text-white font-bold mb-6 text-center">エクスポート期間選択</h3>

                <div className="space-y-4 mb-8">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">開始日 (Start)</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-black text-white p-3 rounded-xl border-2 border-splat-blue focus:border-white outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">終了日 (End)</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-black text-white p-3 rounded-xl border-2 border-splat-pink focus:border-white outline-none"
                        />
                    </div>
                </div>

                <Button
                    fullWidth
                    variant="primary"
                    onClick={handleExport}
                >
                    CSVダウンロード !!
                </Button>
            </div>
        </div>
    );
}
