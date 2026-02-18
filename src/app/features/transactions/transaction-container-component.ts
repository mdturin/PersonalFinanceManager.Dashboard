import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { CategoryService } from '../../core/services/category-service';
import { TransactionService } from '../../core/services/transaction-service';
import { CalendarComponent } from './components/calendar-component/calendar-component';
import { DialogService } from '../../core/services/dialog.service';
import { Transaction, TransactionFilter } from '../../core/models/transaction.model';
import { SpinnerComponent } from '../../shared/components/spinner-component/spinner-component';
import { Account } from '../../core/models/account.model';
import { Category } from '../../core/models/category.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UtilityService } from '../../core/services/utility.service';

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
})
export class TransactionContainerComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);

  isTransactionLoading: boolean = true;
  transactions: Transaction[] = [];

  isGetAccountsLoading: boolean = true;
  accounts: Account[] = [];

  isGetCategoriesLoading: boolean = true;
  categories: Category[] = [];

  currentView: 'grid' | 'calendar' = 'grid';

  filters: TransactionFilter = {
    type: '',
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
      error: console.error,
    });
  }

  loadAccounts() {
    this.accountService.getAccounts().subscribe((accounts: Account[]) => {
      this.accounts = accounts;
      this.isGetAccountsLoading = false;
      this.cdr.markForCheck();
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
      this.isGetCategoriesLoading = false;
      this.cdr.markForCheck();
    });
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
      error: console.error,
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
      error: console.error,
    });
  }

  isTransactionDeleting: { [id: string]: boolean } = {};
  deleteTransaction(id: string) {
    this.isTransactionDeleting[id] = true;
    this.transactionService.deleteTransaction(id).subscribe({
      next: () => {
        // TODO: show deleted toast notification
        console.info(`Transaction with id: ${id} successfully deleted.`);
        this.transactions = this.transactions.filter((t) => t.id !== id);
        delete this.isTransactionDeleting[id];
        this.cdr.markForCheck();
      },
      error: console.error,
    });
  }
}
