import Papa from 'papaparse';
import { Transaction, Category, Budget } from '../types';

export const exportToCSV = (transactions: Transaction[], categories: Category[], budgets: Budget[]) => {
    const data = transactions.map(t => {
        const cat = categories.find(c => c.id === t.categoryId);
        return {
            ID: t.id,
            Date: t.date,
            Amount: t.amount,
            Type: t.type,
            Category: cat ? cat.name : 'Unknown',
            Memo: t.memo,
            IsRecurring: t.isRecurring ? 'Yes' : 'No'
        };
    });

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kaikebo_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
