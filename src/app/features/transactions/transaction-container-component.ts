import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { CategoryService } from '../../core/services/category-service';
import { TransactionService } from '../../core/services/transaction-service';
import { CalendarComponent } from './components/calendar-component/calendar-component';
import { DialogService } from '../../core/services/dialog.service';
import { filter } from 'rxjs/operators';
import { LoaderService } from '../../core/services/loader.service';
import {
  AddTransactionDialogComponent,
  AddTransactionDialogData,
  AddTransactionFormData,
} from './components/add-transaction-dialog/add-transaction-dialog';
import { Transaction, TransactionFilter } from '../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-container-component',
  imports: [CommonModule, FormsModule, CalendarComponent],
  templateUrl: './transaction-container-component.html',
  styleUrl: './transaction-container-component.scss',
})
export class TransactionContainerComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);
  private categoryService = inject(CategoryService);
  private dialogService = inject(DialogService);
  private loader = inject(LoaderService);
  private cdr = inject(ChangeDetectorRef);

  transactions: Transaction[] = [];
  accounts: { id: number; name: string }[] = [];
  categories: { id: number; name: string }[] = [];
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
    this.loader.show();
    this.transactionService.getTransactions(this.filters).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.cdr.markForCheck();
      },
      error: console.error,
      complete: () => {
        this.loader.hide();
      },
    });
  }

  loadAccounts() {
    this.accountService.getAccounts().subscribe((data) => (this.accounts = data));
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((data) => (this.categories = data));
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
      this.filters.startDate = this.formatDate(
        new Date(now.getFullYear(), now.getMonth(), 1)
      );

      this.filters.endDate = this.formatDate(
        new Date(now.getFullYear(), now.getMonth() + 1, 0)
      );
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
      showCloseButton: false,
      config: {
        width: '640px',
        maxWidth: '95vw',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(filter((result): result is AddTransactionFormData => !!result))
      .subscribe((formData: AddTransactionFormData) => {
        this.saveTransaction(formData);
      });
  }

  saveTransaction(formData: AddTransactionFormData) {
    const category = this.categories.find((item) => item.id === Number(formData.categoryId));
    const account = this.accounts.find((item) => item.id === Number(formData.accountId));
    const toAccount = this.accounts.find((item) => item.id === Number(formData.toAccountId));

    this.transactionService
      .addTransaction({
        date: new Date(formData.date),
        type: formData.type,
        category,
        account,
        toAccount: formData.type === 'transfer' ? toAccount : undefined,
        amount: Number(formData.amount ?? 0),
        note: formData.note,
      })
      .subscribe(() => {
        this.loadTransactions();
      });
  }
}
