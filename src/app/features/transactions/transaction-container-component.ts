import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, LOCALE_ID, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { CategoryService } from '../../core/services/category-service';
import { TransactionService } from '../../core/services/transaction-service';
import { CalendarComponent } from './components/calendar-component/calendar-component';
import {
  Transaction,
  TransactionFilter,
  TransactionType,
} from '../../core/models/transaction.model';
import { SpinnerComponent } from '../../shared/components/spinner-component/spinner-component';
import { Account } from '../../core/models/account.model';
import { Category, CategoryType } from '../../core/models/category.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UtilityService } from '../../core/services/utility.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-transaction-container-component',
  imports: [
    CommonModule,
    FormsModule,
    CalendarComponent,
    SpinnerComponent,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './transaction-container-component.html',
  styleUrl: './transaction-container-component.scss',
  providers: [{ provide: LOCALE_ID, useValue: 'bn-BD' }],
})
export class TransactionContainerComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);
  private notificationService = inject(NotificationService);

  categoryTypes = CategoryService.getCateogryTypes();

  isTransactionLoading: boolean = true;
  transactions: Transaction[] = [];

  isGetAccountsLoading: boolean = true;
  accounts: Account[] = [];

  isGetCategoriesLoading: boolean = true;
  categories: Category[] = [];

  currentView: 'grid' | 'calendar' = 'grid';

  filters: TransactionFilter = {
    type: CategoryType.All,
    account: '',
    category: '',
  } as TransactionFilter;

  ngOnInit() {
    this.loadTransactions();
    this.loadAccounts();
    this.loadCategories();
  }

  loadTransactions() {
    this.transactionService.getTransactions(this.filters).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.isTransactionLoading = false;
        this.cdr.markForCheck();
      },
      error: () => this.notificationService.error('Failed to load transactions.'),
    });
  }

  loadAccounts() {
    this.accountService.getAccounts().subscribe({
      next: (accounts: Account[]) => {
        this.accounts = accounts;
        this.isGetAccountsLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isGetAccountsLoading = false;
        this.notificationService.error('Failed to load accounts.');
        this.cdr.markForCheck();
      },
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
        this.isGetCategoriesLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isGetCategoriesLoading = false;
        this.notificationService.error('Failed to load categories.');
        this.cdr.markForCheck();
      },
    });
  }

  getTransactionClass(transaction: Transaction): string {
    return transaction.type === TransactionType.Expense ? 'expense' : 'income';
  }

  getSignedAmount(transaction: Transaction): number {
    return transaction.type === TransactionType.Expense ? -transaction.amount : transaction.amount;
  }

  applyFilters() {
    this.loadTransactions();
  }

  toggleView() {
    this.currentView = this.currentView === 'grid' ? 'calendar' : 'grid';
  }

  setDateFilter(range: 'month' | 'week') {
    const now = new Date();
    if (range === 'month') {
      this.filters.startDate = UtilityService.formatDate(
        new Date(now.getFullYear(), now.getMonth(), 1),
      );

      this.filters.endDate = UtilityService.formatDate(
        new Date(now.getFullYear(), now.getMonth() + 1, 0),
      );
    }

    this.applyFilters();
  }

  addTransaction() {
    const dialogRef = this.transactionService.openAddTransactionModal(
      'Add Transaction',
      null,
      this.accounts,
      this.categories,
    );

    dialogRef.subscribe((formData: Transaction) => {
      this.createTransaction(formData);
    });
  }

  private createTransaction(formData: Transaction) {
    this.transactionService.createTransaction(formData).subscribe({
      next: (createdTransaction: Transaction) => {
        this.transactions = [createdTransaction, ...this.transactions];
        this.cdr.markForCheck();
      },
      error: () => this.notificationService.error('Failed to create transaction.'),
    });
  }

  isTransactionUpdating: { [id: string]: boolean } = {};
  editTransaction(transaction: Transaction) {
    this.isTransactionUpdating[transaction.id] = true;
    const dialogRef = this.transactionService.openAddTransactionModal(
      'Edit Transaction',
      transaction,
      this.accounts,
      this.categories,
    );

    dialogRef.subscribe((formData: Transaction) => {
      this.updateTransaction(formData);
    });
  }

  private updateTransaction(formData: Transaction) {
    this.transactionService.updateTransaction(formData).subscribe({
      next: (updatedTransaction: Transaction) => {
        this.transactions = this.transactions.map((t) =>
          t.id === updatedTransaction.id ? updatedTransaction : t,
        );
        delete this.isTransactionUpdating[updatedTransaction.id];
        this.cdr.markForCheck();
      },
      error: () => this.notificationService.error('Failed to update transaction.'),
    });
  }

  isTransactionDeleting: { [id: string]: boolean } = {};
  deleteTransaction(id: string) {
    this.isTransactionDeleting[id] = true;
    this.transactionService.deleteTransaction(id).subscribe({
      next: () => {
        this.notificationService.success('Transaction deleted successfully.');
        this.transactions = this.transactions.filter((t) => t.id !== id);
        delete this.isTransactionDeleting[id];
        this.cdr.markForCheck();
      },
      error: () => this.notificationService.error('Failed to delete transaction.'),
    });
  }
}
