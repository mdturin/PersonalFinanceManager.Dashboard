import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricModel } from '../../core/models/metric-model';
import { StatCardComponent } from '../../shared/components/stat-card-component/stat-card-component';
import { DashboardService } from '../../core/services/dashboard.service';
import { SpinnerComponent } from '../../shared/components/spinner-component/spinner-component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, StatCardComponent, SpinnerComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  isSummaryLoading = true;
  isCategoryLoading = true;
  isRecentTransactionsLoading = true;

  summaries: MetricModel[] = [];
  topExpenseCategories: MetricModel[] = [];
  recentTransactions: MetricModel[] = [];

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: (summaries: MetricModel[]) => {
        this.summaries = summaries;
        this.isSummaryLoading = false;
        this.cdr.markForCheck();
      }
    });

    this.dashboardService.getTopExpenseCategories().subscribe({
      next: (topExpenseCategories: MetricModel[]) => {
        this.topExpenseCategories = topExpenseCategories;
        this.isCategoryLoading = false;
        this.cdr.markForCheck();
      }
    });

    this.dashboardService.getRecentTransactions().subscribe({
      next: (recentTransactions: MetricModel[]) => {
        this.recentTransactions = recentTransactions;
        this.isRecentTransactionsLoading = false;
        this.cdr.markForCheck();
      }
    })
  }
}
