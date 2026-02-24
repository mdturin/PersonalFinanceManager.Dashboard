import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Budget, BudgetFormData, BudgetProgress } from '../models/budget.model';
import { Transaction } from '../models/transaction.model';
import { CategoryType } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private apiService = inject(ApiService);
  private endpoint = '/api/budgets';

  getBudgets(): Observable<Budget[]> {
    return this.apiService.get<Budget[]>(this.endpoint);
  }

  createBudget(payload: BudgetFormData): Observable<Budget> {
    return this.apiService.post<Budget>(this.endpoint, payload);
  }

  updateBudget(id: string, payload: BudgetFormData): Observable<Budget> {
    return this.apiService.put<Budget>(`${this.endpoint}/${id}`, payload);
  }

  deleteBudget(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  buildProgress(budgets: Budget[], transactions: Transaction[]): BudgetProgress[] {
    const now = new Date();
    const daysElapsed = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const pacingFactor = daysInMonth / Math.max(daysElapsed, 1);

    return budgets.map((budget) => {
      const spent = transactions
        .filter(
          (transaction) =>
            transaction.type === CategoryType.Expense &&
            transaction.categoryId === budget.categoryId &&
            this.formatMonth(transaction.date) === budget.month,
        )
        .reduce((total, transaction) => total + transaction.amount, 0);

      const remaining = budget.amount - spent;
      const progressPercent = budget.amount <= 0 ? 0 : Math.round((spent / budget.amount) * 100);
      const projectedMonthSpend = spent * pacingFactor;
      const projectedOverspend = Math.max(projectedMonthSpend - budget.amount, 0);

      return {
        ...budget,
        spent,
        remaining,
        progressPercent,
        projectedOverspend,
        threshold: this.getThreshold(progressPercent),
      } as BudgetProgress;
    });
  }

  private getThreshold(progressPercent: number): BudgetProgress['threshold'] {
    if (progressPercent >= 100) {
      return 'exceeded';
    }

    if (progressPercent >= 90) {
      return 'high';
    }

    if (progressPercent >= 70) {
      return 'warning';
    }

    return 'safe';
  }

  private formatMonth(dateInput: Date): string {
    const date = new Date(dateInput);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  getCurrentMonthBudgetsWithProgress(transactions: Transaction[]): Observable<BudgetProgress[]> {
    const currentMonth = this.formatMonth(new Date());

    return this.getBudgets().pipe(
      map((budgets) => budgets.filter((budget) => budget.month === currentMonth)),
      map((budgets) => this.buildProgress(budgets, transactions)),
    );
  }
}
