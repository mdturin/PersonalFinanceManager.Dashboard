import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account-service';
import { CategoryService } from '../../services/category-service';
import { TransactionService } from '../../services/transaction-service';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from "./components/calendar-component/calendar-component";

@Component({
  selector: 'app-transaction-component',
  imports: [CommonModule, FormsModule, CalendarComponent],
  templateUrl: './transaction-component.html',
  styleUrl: './transaction-component.scss',
})
export class TransactionComponent implements OnInit {
  transactions: any[] = [];
  accounts: any[] = [];
  categories: any[] = [];
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
  ) {}

  ngOnInit() {
    this.loadTransactions();
    this.loadAccounts();
    this.loadCategories();
  }

  loadTransactions() {
    this.transactionService.getTransactions(this.filters).subscribe((data) => {
      this.transactions = data;
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
    // Open dynamic modal for adding transaction
  }
}
