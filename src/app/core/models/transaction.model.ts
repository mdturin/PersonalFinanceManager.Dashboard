import { Account } from './account.model';
import { Category } from './category.model';

export interface Transaction {
  id: string;

  accountId: string;
  accountName: string;

  categoryId: string;
  categoryName: string;

  type: number;
  amount: number;
  description: string;

  date: Date;
}

export class TransactionFilter {
  type: number = 0;
  account: string = '';
  category: string = '';
  startDate: string | null = null;
  endDate: string | null = null;
}

export interface AddTransactionFormData {
  type: number;
  amount: number;
  date: string;
  categoryId: string;
  accountId: string;
  note: string;
}

export interface AddTransactionDialogData {
  title: string;
  transaction: Transaction | null;
  accounts: Account[];
  categories: Category[];
}

export enum TransactionType {
  All = 0,
  Income = 1,
  Expense = 2,
  Transfer = 3,
}
