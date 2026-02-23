import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { AlertItem } from '../models/alert.model';
import { AccountService } from './account-service';
import { TransactionService } from './transaction-service';
import { BudgetService } from './budget.service';
import { Budget } from '../models/budget.model';
import { Account, AccountType } from '../models/account.model';
import { Transaction, TransactionFilter } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private apiService = inject(ApiService);
  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);
  private budgetService = inject(BudgetService);

  private endpoint = '/api/alerts';

  getAlerts(): Observable<AlertItem[]> {
    return this.apiService.get<AlertItem[]>(this.endpoint).pipe(
      catchError(() => this.generateAlertsFromLiveData()),
      map((alerts) => alerts.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))),
    );
  }

  private generateAlertsFromLiveData(): Observable<AlertItem[]> {
    const allTransactionFilter: TransactionFilter = {
      type: '',
      account: '',
      category: '',
      startDate: null,
      endDate: null,
    };

    return this.transactionService.getTransactions(allTransactionFilter).pipe(
      switchMap((transactions) =>
        this.accountService.getAccounts().pipe(
          map((accounts) => ({ accounts, transactions })),
          switchMap(({ accounts }) =>
            this.budgetService.getBudgets().pipe(
              map((budgets) => this.buildAlerts(accounts, transactions, budgets)),
              catchError(() => of(this.buildAlerts(accounts, transactions, []))),
            ),
          ),
        ),
      ),
    );
  }

  private buildAlerts(accounts: Account[], transactions: Transaction[], budgets: Budget[]): AlertItem[] {
    const alerts: AlertItem[] = [];
    alerts.push(...this.getLowBalanceAlerts(accounts));
    alerts.push(...this.getUnusualSpendingAlerts(transactions));
    alerts.push(...this.getUpcomingDuePaymentAlerts(transactions));

    if (budgets.length > 0) {
      const progressItems = this.budgetService.buildProgress(budgets, transactions);
      progressItems
        .filter((progress) => progress.progressPercent >= 70)
        .forEach((progress) => {
          alerts.push({
            id: `budget-${progress.id}`,
            type: 'budget-threshold',
            title: `${progress.categoryName} budget at ${progress.progressPercent}%`,
            message:
              progress.progressPercent >= 100
                ? `Budget exceeded by ${Math.abs(progress.remaining).toFixed(2)}.`
                : `Remaining budget is ${progress.remaining.toFixed(2)}.`,
            severity:
              progress.progressPercent >= 100
                ? 'critical'
                : progress.progressPercent >= 90
                  ? 'warning'
                  : 'info',
            createdAt: new Date().toISOString(),
            source: 'budget',
          });
        });
    }

    return alerts;
  }

  private getLowBalanceAlerts(accounts: Account[]): AlertItem[] {
    return accounts
      .filter((account) => account.isActive)
      .filter((account) => {
        if (account.type === AccountType.CreditCard) {
          const utilization = account.creditLimit ? account.currentBalance / account.creditLimit : 0;
          return utilization >= 0.85;
        }

        return account.currentBalance <= 100;
      })
      .map((account) => ({
        id: `low-balance-${account.id}`,
        type: 'low-balance' as const,
        title: `${account.name} balance requires attention`,
        message:
          account.type === AccountType.CreditCard
            ? `Credit card utilization is high (${this.toPercent(account.currentBalance, account.creditLimit ?? 1)}).`
            : `Current balance is ${account.currentBalance.toFixed(2)}.`,
        severity: 'warning' as const,
        createdAt: new Date().toISOString(),
        source: account.name,
      }));
  }

  private getUnusualSpendingAlerts(transactions: Transaction[]): AlertItem[] {
    const now = new Date();
    const startCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const currentMonthExpenses = transactions.filter(
      (transaction) =>
        transaction.type.toLowerCase() === 'expense' && new Date(transaction.date) >= startCurrentMonth,
    );

    const lastMonthExpenses = transactions.filter((transaction) => {
      if (transaction.type.toLowerCase() !== 'expense') {
        return false;
      }

      const date = new Date(transaction.date);
      return date >= startLastMonth && date < startCurrentMonth;
    });

    const currentTotal = currentMonthExpenses.reduce((sum, transaction) => sum + transaction.amount, 0);
    const previousTotal = lastMonthExpenses.reduce((sum, transaction) => sum + transaction.amount, 0);

    if (previousTotal <= 0 || currentTotal <= previousTotal * 1.2) {
      return [];
    }

    return [
      {
        id: 'unusual-spending-monthly',
        type: 'unusual-spending',
        title: 'Unusual spending detected',
        message: `Expenses increased by ${Math.round(((currentTotal - previousTotal) / previousTotal) * 100)}% compared to last month.`,
        severity: 'critical',
        createdAt: new Date().toISOString(),
        source: 'transactions',
      },
    ];
  }

  private getUpcomingDuePaymentAlerts(transactions: Transaction[]): AlertItem[] {
    const recurringKeywords = ['rent', 'mortgage', 'loan', 'credit card', 'utility', 'subscription'];

    const recurringPayments = transactions
      .filter((transaction) => transaction.type.toLowerCase() === 'expense')
      .filter((transaction) =>
        recurringKeywords.some((keyword) =>
          `${transaction.categoryName} ${transaction.description}`.toLowerCase().includes(keyword),
        ),
      )
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));

    return recurringPayments.slice(0, 2).map((payment) => {
      const nextDueDate = new Date(payment.date);
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);

      return {
        id: `due-${payment.id}`,
        type: 'due-payment' as const,
        title: `Upcoming payment: ${payment.categoryName}`,
        message: `Expected around ${nextDueDate.toLocaleDateString()} based on previous bill patterns.`,
        severity: 'info' as const,
        createdAt: new Date().toISOString(),
        source: payment.description,
      };
    });
  }

  private toPercent(value: number, total: number): string {
    if (total <= 0) {
      return '0%';
    }

    return `${Math.round((value / total) * 100)}%`;
  }
}
