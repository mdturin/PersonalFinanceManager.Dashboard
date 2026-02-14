export interface Transaction {
    id: string;
    accountName: string;
    type: string;
    amount: number;
    categoryName: string;
    description: string;
    date: Date;
}

export interface CreateTransaction {
    accountId: string;
    type: string;
    amount: number;
    categoryId: string;
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