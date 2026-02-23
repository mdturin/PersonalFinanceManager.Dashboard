export type AccountStatus = 'Active' | 'Needs attention' | 'Inactive';

export interface Account {
  id: string;
  name: string;
  type: number;
  institution: string;
  creditLimit?: number;
  currentBalance: number;
  currency: string;
  isActive: boolean;
  description?: string;
  includeInNetWorth: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum AccountType {
  Checking = 1,
  Savings = 2,
  CreditCard = 3,
  Cash = 4,
  Investment = 5,
  Loan = 6,
  Other = 7,
}
