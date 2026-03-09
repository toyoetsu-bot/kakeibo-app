import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Category, Budget, ViewTab, TransactionType } from '../types';
import { startOfMonth, format, isSameMonth } from 'date-fns';

const defaultCategories: Category[] = [
    { id: 'inc-1', name: '給与', type: 'income', color: '#8fd131', icon: 'Coins' },
    { id: 'inc-2', name: 'お小遣い', type: 'income', color: '#1942d8', icon: 'Gift' },
    { id: 'inc-3', name: 'その他', type: 'income', color: '#dff619', icon: 'PlusCircle' },

    { id: 'exp-1', name: '食費', type: 'expense', color: '#ec1d7c', icon: 'Utensils' },
    { id: 'exp-2', name: '交通費', type: 'expense', color: '#f28322', icon: 'Bus' },
    { id: 'exp-3', name: '交際費', type: 'expense', color: '#6d2bb8', icon: 'Users' },
    { id: 'exp-4', name: '書籍・教材', type: 'expense', color: '#1942d8', icon: 'BookOpen' },
    { id: 'exp-5', name: '日用品', type: 'expense', color: '#8fd131', icon: 'ShoppingBag' },
    { id: 'exp-6', name: '住居費', type: 'expense', color: '#00ced1', icon: 'Home' },
    { id: 'exp-7', name: '旅費', type: 'expense', color: '#ff69b4', icon: 'Plane' },
    { id: 'exp-8', name: 'その他', type: 'expense', color: '#a0a0a0', icon: 'MoreHorizontal' },
];

interface AppState {
    currentTab: ViewTab;
    currentDate: string; // ISO string representing currently viewed month (YYYY-MM-01)
    selectedDay: string | null; // Selected day YYYY-MM-DD
    editingTransactionId: string | null; // ID of the transaction being edited

    transactions: Transaction[];
    categories: Category[];
    budgets: Budget[];

    // Actions
    setTab: (tab: ViewTab) => void;
    setCurrentMonth: (dateStr: string) => void;
    setSelectedDay: (dateStr: string | null) => void;
    setEditingTransactionId: (id: string | null) => void;

    addTransaction: (t: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: string) => void;
    updateTransaction: (id: string, t: Partial<Transaction>) => void;

    addCategory: (c: Omit<Category, 'id'>) => void;
    setBudget: (categoryId: string, amount: number) => void;

    // Importers
    importData: (data: { transactions: Transaction[], categories: Category[], budgets: Budget[] }) => void;
    clearData: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            currentTab: 'calendar',
            currentDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
            selectedDay: null,
            editingTransactionId: null,

            transactions: [],
            categories: defaultCategories,
            budgets: [],

            setTab: (tab) => set({ currentTab: tab }),
            setCurrentMonth: (dateStr) => set({ currentDate: dateStr }),
            setSelectedDay: (dateStr) => set({ selectedDay: dateStr }),
            setEditingTransactionId: (id) => set({ editingTransactionId: id }),

            addTransaction: (t) => set((state) => ({
                transactions: [...state.transactions, { ...t, id: crypto.randomUUID() }]
            })),

            deleteTransaction: (id) => set((state) => ({
                transactions: state.transactions.filter(tr => tr.id !== id)
            })),

            updateTransaction: (id, data) => set((state) => ({
                transactions: state.transactions.map(tr =>
                    tr.id === id ? { ...tr, ...data } : tr
                )
            })),

            addCategory: (c) => set((state) => {
                const newCategories = [...state.categories, { ...c, id: `cat-${crypto.randomUUID()}` }];

                // Sort to ensure 'その他' is always at the end
                newCategories.sort((a, b) => {
                    if (a.name === 'その他') return 1;
                    if (b.name === 'その他') return -1;
                    return 0; // Keep other categories in their original order
                });

                return { categories: newCategories };
            }),

            setBudget: (categoryId, amount) => set((state) => {
                const existing = state.budgets.find(b => b.categoryId === categoryId);
                if (existing) {
                    return {
                        budgets: state.budgets.map(b =>
                            b.categoryId === categoryId ? { ...b, amount } : b
                        )
                    };
                }
                return {
                    budgets: [...state.budgets, { categoryId, amount }]
                };
            }),

            importData: (data) => set(() => ({
                transactions: data.transactions || [],
                categories: data.categories || defaultCategories,
                budgets: data.budgets || []
            })),

            clearData: () => set(() => ({
                transactions: [],
                categories: defaultCategories,
                budgets: [],
                selectedDay: null
            }))
        }),
        {
            name: 'kaikebo-splatoon-storage',
            merge: (persistedState: any, currentState) => {
                // Ensure new default categories are added to existing users
                const persistedCategories = persistedState?.categories || [];
                const mergedCategories = [...persistedCategories];

                defaultCategories.forEach(defaultCat => {
                    const existingCatIndex = mergedCategories.findIndex(c => c.name === defaultCat.name);
                    if (existingCatIndex === -1) {
                        // Not found, add the new default category
                        mergedCategories.push(defaultCat);
                    } else {
                        // Found by name, overwrite its color and icon with the latest defaults
                        mergedCategories[existingCatIndex] = {
                            ...mergedCategories[existingCatIndex],
                            color: defaultCat.color,
                            icon: defaultCat.icon
                        };
                    }
                });

                // Sort to ensure 'その他' is always at the end after merge
                mergedCategories.sort((a, b) => {
                    if (a.name === 'その他') return 1;
                    if (b.name === 'その他') return -1;
                    return 0;
                });

                return {
                    ...currentState,
                    ...persistedState,
                    categories: mergedCategories,
                };
            }
        }
    )
);
