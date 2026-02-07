import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account-service';
import { CategoryService } from '../../services/category-service';
import { TransactionService } from '../../services/transaction-service';
import { CalendarComponent } from './components/calendar-component/calendar-component';
import { DialogService } from '../../services/dialog.service';
import { filter } from 'rxjs/operators';
import { LoaderService } from '../../services/loader.service';
import {
  AddTransactionDialogComponent,
  AddTransactionDialogData,
  AddTransactionFormData,
} from './components/add-transaction-dialog/add-transaction-dialog';

@Component({
  selector: 'app-transaction-container-component',
  imports: [CommonModule, FormsModule, CalendarComponent],
  templateUrl: './transaction-container-component.html',
  styleUrl: './transaction-container-component.scss',
})
export class TransactionContainerComponent implements OnInit {
  transactions: any[] = [];
  accounts: Array<{ id: number; name: string }> = [];
  categories: Array<{ id: number; name: string }> = [];
  currentView: 'grid' | 'calendar' = 'grid';

  filters = {
    type: '',
    account: '',
    category: '',
    startDate: '',
    endDate: '',
  };

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private categoryService: CategoryService,
    private dialogService: DialogService,
    private loader: LoaderService,

    // angular services
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadTransactions();
    this.loadAccounts();
    this.loadCategories();
  }

  loadTransactions() {
    this.loader.show();
    this.transactionService.getTransactions(this.filters).subscribe({
      next: (data) => {
        this.transactions = data;
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

  setDateFilter(range: 'month' | 'week') {
    const now = new Date();
    if (range === 'month') {
      this.filters.startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split('T')[0];
      this.filters.endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0];
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
