import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Budget, BudgetFormData, BudgetProgress } from '../../core/models/budget.model';
import { Category } from '../../core/models/category.model';
import { Transaction } from '../../core/models/transaction.model';
import { BudgetService } from '../../core/services/budget.service';
import { CategoryService } from '../../core/services/category-service';
import { NotificationService } from '../../core/services/notification.service';
import { TransactionService } from '../../core/services/transaction-service';
import { SpinnerComponent } from '../../shared/components/spinner-component/spinner-component';

@Component({
  selector: 'app-budgets',
  imports: [CommonModule, FormsModule, SpinnerComponent],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss',
})
export class BudgetsComponent implements OnInit {
  private budgetService = inject(BudgetService);
  private transactionService = inject(TransactionService);
  private categoryService = inject(CategoryService);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
  budgets: Budget[] = [];
  progressItems: BudgetProgress[] = [];
  categories: Category[] = [];
  transactions: Transaction[] = [];

  editingBudgetId: string | null = null;
  form: BudgetFormData = {
    categoryId: '',
    amount: 0,
    month: this.currentMonth(),
  };

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    forkJoin({
      budgets: this.budgetService.getBudgets(),
      categories: this.categoryService.getCategories(),
      transactions: this.transactionService.getTransactions({
        type: '',
        account: '',
        category: '',
        startDate: null,
        endDate: null,
      }),
    }).subscribe({
      next: ({ budgets, categories, transactions }) => {
        this.budgets = budgets;
        this.categories = categories;
        this.transactions = transactions;
        this.progressItems = this.budgetService.buildProgress(this.budgets, this.transactions);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.notificationService.error('Failed to load budgets.');
        this.cdr.markForCheck();
      },
    });
  }

  saveBudget(): void {
    if (!this.form.categoryId || !this.form.month || this.form.amount <= 0) {
      this.notificationService.info('Please select category, month, and a positive amount.');
      return;
    }

    const operation = this.editingBudgetId
      ? this.budgetService.updateBudget(this.editingBudgetId, this.form)
      : this.budgetService.createBudget(this.form);

    operation.subscribe({
      next: () => {
        this.notificationService.success(
          this.editingBudgetId ? 'Budget updated successfully.' : 'Budget created successfully.',
        );
        this.resetForm();
        this.loadData();
      },
      error: () => this.notificationService.error('Failed to save budget.'),
    });
  }

  editBudget(item: BudgetProgress): void {
    this.editingBudgetId = item.id;
    this.form = {
      categoryId: item.categoryId,
      month: item.month,
      amount: item.amount,
    };
  }

  deleteBudget(item: BudgetProgress): void {
    this.budgetService.deleteBudget(item.id).subscribe({
      next: () => {
        this.notificationService.success('Budget deleted successfully.');
        this.loadData();
      },
      error: () => this.notificationService.error('Failed to delete budget.'),
    });
  }

  resetForm(): void {
    this.editingBudgetId = null;
    this.form = {
      categoryId: '',
      amount: 0,
      month: this.currentMonth(),
    };
  }

  progressBarClass(item: BudgetProgress): string {
    if (item.threshold === 'exceeded') {
      return 'bg-danger';
    }

    if (item.threshold === 'high') {
      return 'bg-warning';
    }

    if (item.threshold === 'warning') {
      return 'bg-info';
    }

    return 'bg-success';
  }

  thresholdTextClass(item: BudgetProgress): string {
    if (item.threshold === 'exceeded') {
      return 'text-danger';
    }

    if (item.threshold === 'high') {
      return 'text-warning';
    }

    if (item.threshold === 'warning') {
      return 'text-info';
    }

    return 'text-success';
  }

  private currentMonth(): string {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }
}
