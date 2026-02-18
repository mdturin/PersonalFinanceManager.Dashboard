import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  AddTransactionDialogData,
  AddTransactionFormData,
  Transaction,
  TransactionFilter,
} from '../models/transaction.model';
import { HttpParams } from '@angular/common/http';
import { AddTransactionDialogComponent } from '../../features/transactions/components/add-transaction-dialog/add-transaction-dialog';
import { DialogService } from './dialog.service';
import { Account } from '../models/account.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private transactionsEndpoint = '/api/transactions';

  private apiService = inject(ApiService);
  private dialogService = inject(DialogService);

  getTransactions(filters: TransactionFilter): Observable<Transaction[]> {
    let params = new HttpParams()
      .set('type', filters.type ?? '')
      .set('accountId', filters.account ?? '')
      .set('categoryName', filters.category ?? '')
      .set('startDate', filters.startDate ?? '')
      .set('endDate', filters.endDate ?? '');

    return this.apiService.get<Transaction[]>(this.transactionsEndpoint, { params });
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.apiService.post<Transaction>(this.transactionsEndpoint, transaction);
  }

  updateTransaction(transaction: Transaction): Observable<Transaction> {
    return this.apiService.put<Transaction>(
      `${this.transactionsEndpoint}/${transaction.id}`,
      transaction,
    );
  }

  deleteTransaction(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.transactionsEndpoint}/${id}`);
  }

  openAddTransactionModal(
    title: string,
    transaction: Transaction | null,
    accounts: Account[],
    categories: Category[],
  ): Observable<Transaction> {
    const dialogRef = this.dialogService.openComponent<
      AddTransactionDialogComponent,
      AddTransactionDialogData,
      AddTransactionFormData
    >({
      component: AddTransactionDialogComponent,
      data: {
        title: title,
        accounts: accounts,
        categories: categories,
        transaction: transaction,
      },
      config: {
        width: '640px',
        maxWidth: '95vw',
      },
    });

    return dialogRef.pipe(
      map((result) => {
        return {
          id: transaction?.id,
          accountId: result.accountId,
          categoryId: result.categoryId,
          amount: result.amount,
          date: new Date(result.date),
          type: result.type,
          description: result.note,
        } as Transaction;
      }),
    );
  }
}
