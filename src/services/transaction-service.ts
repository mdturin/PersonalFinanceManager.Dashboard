import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private dummyTransactions = [
    {
      id: 1,
      date: new Date(),
      type: 'expense',
      category: { id: 1, name: 'Food' },
      account: { id: 1, name: 'Cash' },
      amount: 450,
      note: 'Lunch at Cafe'
    },
    {
      id: 2,
      date: new Date(),
      type: 'income',
      category: { id: 2, name: 'Salary' },
      account: { id: 2, name: 'Bank' },
      amount: 52000,
      note: 'Monthly salary'
    },
    {
      id: 3,
      date: new Date(),
      type: 'transfer',
      category: { id: 3, name: 'Transfer' },
      account: { id: 2, name: 'Bank' },
      toAccount: { id: 1, name: 'Cash' },
      amount: 5000,
      note: 'Bank to Cash'
    },
    {
      id: 4,
      date: new Date(new Date().setDate(new Date().getDate() - 1)),
      type: 'expense',
      category: { id: 4, name: 'Transport' },
      account: { id: 1, name: 'Cash' },
      amount: 120,
      note: 'Uber ride'
    },
    {
      id: 5,
      date: new Date(new Date().setDate(new Date().getDate() - 2)),
      type: 'income',
      category: { id: 5, name: 'Freelance' },
      account: { id: 2, name: 'Bank' },
      amount: 8000,
      note: 'Project payment'
    },
    {
      id: 6,
      date: new Date(new Date().setDate(new Date().getDate() - 5)),
      type: 'expense',
      category: { id: 6, name: 'Shopping' },
      account: { id: 1, name: 'Cash' },
      amount: 2200,
      note: 'New clothes'
    },
  ];

  constructor() {}

  getTransactions(filters: any): Observable<any[]> {
    let data = [...this.dummyTransactions];

    if (filters.type) {
      data = data.filter(t => t.type === filters.type);
    }
    if (filters.account) {
      data = data.filter(t => t.account.id == filters.account);
    }
    if (filters.category) {
      data = data.filter(t => t.category.id == filters.category);
    }
    if (filters.startDate) {
      data = data.filter(t => new Date(t.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      data = data.filter(t => new Date(t.date) <= new Date(filters.endDate));
    }

    return of(data);
  }

  addTransaction(transaction: any): Observable<any> {
    const nextId = this.dummyTransactions.length
      ? Math.max(...this.dummyTransactions.map((item) => item.id)) + 1
      : 1;
    const newTransaction = {
      id: nextId,
      ...transaction,
    };

    this.dummyTransactions = [newTransaction, ...this.dummyTransactions];

    return of(newTransaction);
  }
}
