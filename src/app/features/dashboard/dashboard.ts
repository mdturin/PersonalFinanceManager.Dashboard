import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricModel } from '../../core/models/metric-model';
import { StatCardComponent } from '../../shared/components/stat-card-component/stat-card-component';
import { DashboardService } from '../../core/services/dashboard.service';
import { SpinnerComponent } from '../../shared/components/spinner-component/spinner-component';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, StatCardComponent, SpinnerComponent, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  isSummaryLoading = true;
  summaries: MetricModel[] = [];

  isCategoryLoading = true;
  topExpenseCategories: MetricModel[] = [];

  isRecentTransactionsLoading = true;
  recentTransactions: MetricModel[] = [];

  isBudgetUsagesLoading = true;
  budgetUsages: MetricModel[] = [];

  isExpenseTrendLoading = true;
  expenseTrend: MetricModel[] = [];
  expenseChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Expenses',
      },
    ],
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };

  isIncomeVsExpenseLoading = true;
  incomeVsExpense: MetricModel[] = [];
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Income Vs Expense',
        backgroundColor: [],
      },
    ],
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: (summaries: MetricModel[]) => {
        this.summaries = summaries;
        this.isSummaryLoading = false;
        this.cdr.markForCheck();
      },
    });

    this.dashboardService.getTopExpenseCategories().subscribe({
      next: (topExpenseCategories: MetricModel[]) => {
        this.topExpenseCategories = topExpenseCategories;
        this.isCategoryLoading = false;
        this.cdr.markForCheck();
      },
    });

    this.dashboardService.getRecentTransactions().subscribe({
      next: (recentTransactions: MetricModel[]) => {
        this.recentTransactions = recentTransactions;
        this.isRecentTransactionsLoading = false;
        this.cdr.markForCheck();
      },
    });

    this.dashboardService.getExpenseTrend().subscribe({
      next: (expenseTrend: MetricModel[]) => {
        this.expenseTrend = expenseTrend;
        this.expenseChartData.labels = expenseTrend.map((x) => x.label);
        this.expenseChartData.datasets[0].data = expenseTrend.map((x) => +x.value);
        this.isExpenseTrendLoading = false;
        this.cdr.detectChanges();
      },
    });

    this.dashboardService.getIncomeVsExpense().subscribe({
      next: (incomeVsExpense: MetricModel[]) => {
        this.incomeVsExpense = incomeVsExpense;
        this.barChartData.labels = incomeVsExpense.map((x) => x.label);
        const dataset = this.barChartData.datasets[0];
        dataset.data = incomeVsExpense.map((x) => +x.value);
        dataset.backgroundColor = incomeVsExpense.map((x) => x.trend);

        this.isIncomeVsExpenseLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
