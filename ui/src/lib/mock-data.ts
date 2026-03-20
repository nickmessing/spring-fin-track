import type { Account, Category, Transaction } from '@/graphql'
import { CategoryKind, TransactionKind } from '@/graphql'

const now = new Date()
function daysAgo(days: number): string {
  const d = new Date(now)
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

// ---- Categories ----

export const expenseCategories: Category[] = [
  {
    __typename: 'Category',
    id: 'cat-1',
    name: 'Food',
    icon: '\uD83C\uDF54',
    kind: CategoryKind.Expense,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(90),
  },
  {
    __typename: 'Category',
    id: 'cat-2',
    name: 'Transport',
    icon: '\uD83D\uDE8C',
    kind: CategoryKind.Expense,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(90),
  },
  {
    __typename: 'Category',
    id: 'cat-3',
    name: 'Shopping',
    icon: '\uD83D\uDECD\uFE0F',
    kind: CategoryKind.Expense,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(90),
  },
  {
    __typename: 'Category',
    id: 'cat-4',
    name: 'Entertainment',
    icon: '\uD83C\uDFAC',
    kind: CategoryKind.Expense,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(90),
  },
  {
    __typename: 'Category',
    id: 'cat-5',
    name: 'Health',
    icon: '\uD83C\uDFE5',
    kind: CategoryKind.Expense,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(90),
  },
  {
    __typename: 'Category',
    id: 'cat-6',
    name: 'Bills',
    icon: '\uD83D\uDCCB',
    kind: CategoryKind.Expense,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(90),
  },
  {
    __typename: 'Category',
    id: 'cat-7',
    name: 'Education',
    icon: '\uD83D\uDCDA',
    kind: CategoryKind.Expense,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(90),
  },
  {
    __typename: 'Category',
    id: 'cat-8',
    name: 'Gifts',
    icon: '\uD83C\uDF81',
    kind: CategoryKind.Expense,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(90),
  },
]

export const incomeCategories: Category[] = [
  {
    __typename: 'Category',
    id: 'cat-10',
    name: 'Salary',
    icon: '\uD83D\uDCB0',
    kind: CategoryKind.Income,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(90),
  },
  {
    __typename: 'Category',
    id: 'cat-11',
    name: 'Freelance',
    icon: '\uD83D\uDCBB',
    kind: CategoryKind.Income,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(90),
  },
  {
    __typename: 'Category',
    id: 'cat-12',
    name: 'Investments',
    icon: '\uD83D\uDCC8',
    kind: CategoryKind.Income,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(90),
  },
  {
    __typename: 'Category',
    id: 'cat-13',
    name: 'Other',
    icon: '\uD83D\uDCB8',
    kind: CategoryKind.Income,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(90),
  },
]

export const categories: Category[] = [...expenseCategories, ...incomeCategories]

function cat(id: string): Category {
  return categories.find((c) => c.id === id)!
}

// ---- Accounts ----

export const accounts: Account[] = [
  {
    __typename: 'Account',
    id: 'acc-1',
    name: 'Cash',
    icon: '\uD83D\uDCB5',
    balance: 45_230,
    initialBalance: 10_000,
    currency: 'USD',
    createdAt: daysAgo(90),
    updatedAt: daysAgo(0),
  },
  {
    __typename: 'Account',
    id: 'acc-2',
    name: 'Bank Card',
    icon: '\uD83D\uDCB3',
    balance: 278_540,
    initialBalance: 100_000,
    currency: 'USD',
    createdAt: daysAgo(90),
    updatedAt: daysAgo(0),
  },
  {
    __typename: 'Account',
    id: 'acc-3',
    name: 'Savings',
    icon: '\uD83C\uDFE6',
    balance: 1_520_000,
    initialBalance: 500_000,
    currency: 'USD',
    createdAt: daysAgo(90),
    updatedAt: daysAgo(0),
  },
]

function acc(id: string): Account {
  return accounts.find((a) => a.id === id)!
}

// ---- Transactions ----

export const transactions: Transaction[] = [
  // Today
  {
    __typename: 'Transaction',
    id: 'tx-1',
    kind: TransactionKind.Expense,
    amount: 1250,
    description: 'Lunch at cafe',
    createdAt: daysAgo(0),
    updatedAt: daysAgo(0),
    account: acc('acc-2'),
    category: cat('cat-1'),
    destinationAccount: null,
    destinationAmount: null,
  },
  {
    __typename: 'Transaction',
    id: 'tx-2',
    kind: TransactionKind.Expense,
    amount: 350,
    description: 'Bus ticket',
    createdAt: daysAgo(0),
    updatedAt: daysAgo(0),
    account: acc('acc-1'),
    category: cat('cat-2'),
    destinationAccount: null,
    destinationAmount: null,
  },
  // Yesterday
  {
    __typename: 'Transaction',
    id: 'tx-3',
    kind: TransactionKind.Income,
    amount: 450_000,
    description: 'Monthly salary',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    account: acc('acc-2'),
    category: cat('cat-10'),
    destinationAccount: null,
    destinationAmount: null,
  },
  {
    __typename: 'Transaction',
    id: 'tx-4',
    kind: TransactionKind.Expense,
    amount: 8_990,
    description: 'New headphones',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    account: acc('acc-2'),
    category: cat('cat-3'),
    destinationAccount: null,
    destinationAmount: null,
  },
  // 2 days ago
  {
    __typename: 'Transaction',
    id: 'tx-5',
    kind: TransactionKind.Expense,
    amount: 4_500,
    description: 'Movie tickets',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
    account: acc('acc-1'),
    category: cat('cat-4'),
    destinationAccount: null,
    destinationAmount: null,
  },
  {
    __typename: 'Transaction',
    id: 'tx-6',
    kind: TransactionKind.Transfer,
    amount: 20_000,
    description: 'To savings',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
    account: acc('acc-2'),
    category: null,
    destinationAccount: acc('acc-3'),
    destinationAmount: 20_000,
  },
  // 4 days ago
  {
    __typename: 'Transaction',
    id: 'tx-7',
    kind: TransactionKind.Expense,
    amount: 15_000,
    description: 'Electricity bill',
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
    account: acc('acc-2'),
    category: cat('cat-6'),
    destinationAccount: null,
    destinationAmount: null,
  },
  {
    __typename: 'Transaction',
    id: 'tx-8',
    kind: TransactionKind.Expense,
    amount: 2_340,
    description: 'Groceries',
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
    account: acc('acc-1'),
    category: cat('cat-1'),
    destinationAccount: null,
    destinationAmount: null,
  },
  // 6 days ago
  {
    __typename: 'Transaction',
    id: 'tx-9',
    kind: TransactionKind.Income,
    amount: 75_000,
    description: 'Freelance project',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(6),
    account: acc('acc-2'),
    category: cat('cat-11'),
    destinationAccount: null,
    destinationAmount: null,
  },
  {
    __typename: 'Transaction',
    id: 'tx-10',
    kind: TransactionKind.Expense,
    amount: 3_200,
    description: 'Uber ride',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(6),
    account: acc('acc-1'),
    category: cat('cat-2'),
    destinationAccount: null,
    destinationAmount: null,
  },
  // 10 days ago
  {
    __typename: 'Transaction',
    id: 'tx-11',
    kind: TransactionKind.Expense,
    amount: 5_600,
    description: 'Doctor visit',
    createdAt: daysAgo(10),
    updatedAt: daysAgo(10),
    account: acc('acc-2'),
    category: cat('cat-5'),
    destinationAccount: null,
    destinationAmount: null,
  },
  {
    __typename: 'Transaction',
    id: 'tx-12',
    kind: TransactionKind.Expense,
    amount: 12_500,
    description: 'Online course',
    createdAt: daysAgo(10),
    updatedAt: daysAgo(10),
    account: acc('acc-2'),
    category: cat('cat-7'),
    destinationAccount: null,
    destinationAmount: null,
  },
  // 15 days ago
  {
    __typename: 'Transaction',
    id: 'tx-13',
    kind: TransactionKind.Expense,
    amount: 6_800,
    description: 'Birthday gift',
    createdAt: daysAgo(15),
    updatedAt: daysAgo(15),
    account: acc('acc-1'),
    category: cat('cat-8'),
    destinationAccount: null,
    destinationAmount: null,
  },
  {
    __typename: 'Transaction',
    id: 'tx-14',
    kind: TransactionKind.Income,
    amount: 12_000,
    description: 'Dividend payout',
    createdAt: daysAgo(15),
    updatedAt: daysAgo(15),
    account: acc('acc-3'),
    category: cat('cat-12'),
    destinationAccount: null,
    destinationAmount: null,
  },
  // 20 days ago
  {
    __typename: 'Transaction',
    id: 'tx-15',
    kind: TransactionKind.Expense,
    amount: 1_800,
    description: 'Coffee & snacks',
    createdAt: daysAgo(20),
    updatedAt: daysAgo(20),
    account: acc('acc-1'),
    category: cat('cat-1'),
    destinationAccount: null,
    destinationAmount: null,
  },
  {
    __typename: 'Transaction',
    id: 'tx-16',
    kind: TransactionKind.Transfer,
    amount: 50_000,
    description: 'Monthly savings',
    createdAt: daysAgo(20),
    updatedAt: daysAgo(20),
    account: acc('acc-2'),
    category: null,
    destinationAccount: acc('acc-3'),
    destinationAmount: 50_000,
  },
  // 25 days ago
  {
    __typename: 'Transaction',
    id: 'tx-17',
    kind: TransactionKind.Expense,
    amount: 22_000,
    description: 'Internet bill',
    createdAt: daysAgo(25),
    updatedAt: daysAgo(25),
    account: acc('acc-2'),
    category: cat('cat-6'),
    destinationAccount: null,
    destinationAmount: null,
  },
  {
    __typename: 'Transaction',
    id: 'tx-18',
    kind: TransactionKind.Income,
    amount: 5_000,
    description: 'Cash back reward',
    createdAt: daysAgo(25),
    updatedAt: daysAgo(25),
    account: acc('acc-2'),
    category: cat('cat-13'),
    destinationAccount: null,
    destinationAmount: null,
  },
]

// ---- Palette for chart segments ----

export const categoryColors: Record<string, string> = {
  'cat-1': '#f97316', // orange
  'cat-2': '#3b82f6', // blue
  'cat-3': '#ec4899', // pink
  'cat-4': '#8b5cf6', // purple
  'cat-5': '#ef4444', // red
  'cat-6': '#14b8a6', // teal
  'cat-7': '#f59e0b', // amber
  'cat-8': '#10b981', // emerald
}
