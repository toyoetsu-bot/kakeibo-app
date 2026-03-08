import React, { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { CalendarView } from './components/views/CalendarView';
import { InputView } from './components/views/InputView';
import { ReportView } from './components/views/ReportView';
import { BottomNav } from './components/BottomNav';
import { ExportModal } from './components/ExportModal';
import { exportToCSV } from './utils/csvHelpers';
import { Download, Upload } from 'lucide-react';
import Papa from 'papaparse';
import type { Transaction, Category, Budget } from './types';

function App() {
  const { currentTab, transactions, categories, budgets, importData } = useAppStore();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        // Basic mapping for demo purposes. A robust app would validate this.
        const importedTransactions: Transaction[] = results.data
          .filter((row: any) => row.ID && row.Amount) // Filter valid rows
          .map((row: any) => {
            const cat = categories.find(c => c.name === row.Category);
            return {
              id: row.ID,
              date: row.Date,
              amount: Number(row.Amount),
              type: row.Type as 'income' | 'expense',
              categoryId: cat ? cat.id : categories[0].id,
              memo: row.Memo,
              isRecurring: row.IsRecurring === 'Yes'
            };
          });

        if (importedTransactions.length > 0) {
          importData({ transactions: importedTransactions, categories, budgets });
          alert('CSVデータをインポートしました！(CSV imported successfully!)');
        }
      }
    });
  };

  const handleExport = (startDate: string, endDate: string) => {
    // Filter transactions within the selected date range
    const filteredTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= new Date(startDate) && tDate <= new Date(endDate);
    });

    if (filteredTransactions.length === 0) {
      alert('選択した期間にデータがありません！(No data found in the selected range)');
      return;
    }

    exportToCSV(filteredTransactions, categories, budgets);
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto relative overflow-hidden bg-splat-dark flex flex-col font-splatoon shadow-2xl">
      {/* Header bar with CSV actions */}
      <div className="h-14 bg-splat-black border-b-4 border-gray-800 flex justify-between items-center px-4 shrink-0 z-50">
        <h1 className="text-xl font-black text-white italic tracking-wider">
          <span className="text-splat-pink">Spl</span><span className="text-splat-green">at</span> <span className="text-splat-yellow">Kakeibo</span>
        </h1>
        <div className="flex gap-3">
          <label className="text-gray-400 hover:text-splat-green cursor-pointer transition-colors" title="Import CSV">
            <Upload size={20} />
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
          </label>
          <button
            className="text-gray-400 hover:text-splat-blue transition-colors"
            onClick={() => setIsExportModalOpen(true)}
            title="Export CSV"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {currentTab === 'calendar' && <CalendarView />}
        {currentTab === 'input' && <InputView />}
        {currentTab === 'report' && <ReportView />}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
}

export default App;
