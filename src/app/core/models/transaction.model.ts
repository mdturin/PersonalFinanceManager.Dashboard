export interface Transaction {
    id: string;
    accountId: string;
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
    startDate: Date | null = null;
    endDate: Date | null = null;
}