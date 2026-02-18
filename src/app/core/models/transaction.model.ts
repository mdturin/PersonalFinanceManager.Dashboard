import { Account } from './account.model';
import { Category } from './category.model';

export interface Transaction {
  id: string;

  accountId: string;
  accountName: string;

  categoryId: string;
  categoryName: string;

  type: string;
  amount: number;
  description: string;

  date: Date;
}

export class TransactionFilter {
  type: string = '';
  account: string = '';
  category: string = '';
  startDate: string | null = null;
  endDate: string | null = null;
}

export interface AddTransactionFormData {
  type: string;
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
