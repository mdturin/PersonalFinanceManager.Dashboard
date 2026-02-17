import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { CreateTransaction, Transaction, TransactionFilter } from '../models/transaction.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private transactionsEndpoint = '/api/transactions';
  private apiService = inject(ApiService);

  getTransactions(filters: TransactionFilter): Observable<Transaction[]> {
    let params = new HttpParams()
      .set('type', filters.type ?? '')
      .set('accountId', filters.account ?? '')
      .set('categoryName', filters.category ?? '')
      .set('startDate', filters.startDate ?? '')
      .set('endDate', filters.endDate ?? '');

    return this.apiService.get<Transaction[]>(this.transactionsEndpoint, { params });
  }

  createTransaction(transaction: CreateTransaction): Observable<Transaction> {
    return this.apiService.post<Transaction>(this.transactionsEndpoint, transaction);
  }

  deleteTransaction(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.transactionsEndpoint}/${id}`);
  }
}
