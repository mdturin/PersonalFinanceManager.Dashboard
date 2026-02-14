export interface Transaction {
    id: string;
    accountName: string;
    targetAccountId: string;
    type: string;
    amount: number;
    categoryName: string;
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