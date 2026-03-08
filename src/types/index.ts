export type TransactionType = 'income' | 'expense';

export interface Category {
    id: string;
    name: string;
    type: TransactionType;
    color: string;
    icon: string;
}

export interface Transaction {
    id: string;
    amount: number;
    date: string; // ISO string YYYY-MM-DD
    categoryId: string;
    memo: string;
    type: TransactionType;
    isRecurring?: boolean;
}

export interface Budget {
    categoryId: string;
    amount: number;
}

export type ViewTab = 'calendar' | 'input' | 'report' | 'settings';
