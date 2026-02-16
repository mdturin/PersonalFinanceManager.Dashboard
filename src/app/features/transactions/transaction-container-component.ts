import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { CategoryService } from '../../core/services/category-service';
import { TransactionService } from '../../core/services/transaction-service';
import { CalendarComponent } from './components/calendar-component/calendar-component';
import { DialogService } from '../../core/services/dialog.service';
import {
  AddTransactionDialogComponent,
  AddTransactionDialogData,
  AddTransactionFormData,
} from './components/add-transaction-dialog/add-transaction-dialog';
import {
  CreateTransaction,
  Transaction,
  TransactionFilter,
} from '../../core/models/transaction.model';
import { SpinnerComponent } from '../../shared/components/spinner-component/spinner-component';
import { Account } from '../../core/models/account.model';
import { Category } from '../../core/models/category.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-transaction-container-component',
  imports: [
    CommonModule,
    FormsModule,
    CalendarComponent,
    SpinnerComponent,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './transaction-container-component.html',
  styleUrl: './transaction-container-component.scss',
})
export class TransactionContainerComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);
  private categoryService = inject(CategoryService);
  private dialogService = inject(DialogService);
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

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  setDateFilter(range: 'month' | 'week') {
    const now = new Date();
    if (range === 'month') {
      this.filters.startDate = this.formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
      this.filters.endDate = this.formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    }

    this.applyFilters();
  }

  openAddTransactionModal() {
    const dialogRef = this.dialogService.openComponent<
      AddTransactionDialogComponent,
      AddTransactionDialogData,
      AddTransactionFormData
    >({
      component: AddTransactionDialogComponent,
      data: {
        accounts: this.accounts,
        categories: this.categories,
      },
      config: {
        width: '640px',
        maxWidth: '95vw',
      },
    });

    dialogRef.subscribe((formData: AddTransactionFormData) => {
      this.saveTransaction(formData);
    });
  }

  private saveTransaction(formData: AddTransactionFormData) {
    const transaction: CreateTransaction = {
      accountId: formData.accountId,
      amount: formData.amount,
      categoryId: formData.categoryId,
      date: new Date(formData.date),
      type: formData.type,
      description: formData.note,
    };

    this.transactionService.createTransaction(transaction).subscribe({
      next: (createdTransaction: Transaction) => {
        this.transactions = [createdTransaction, ...this.transactions];
        this.cdr.markForCheck();
      },
      error: console.error,
    });
  }

  editTransaction(transaction: Transaction) {}

  deleteTransaction(id: string) {}
}
