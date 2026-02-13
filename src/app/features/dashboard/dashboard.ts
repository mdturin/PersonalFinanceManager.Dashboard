import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricModel } from '../../core/models/metric-model';
import { StatCardComponent } from '../../shared/components/stat-card-component/stat-card-component';
import { ApiService } from '../../core/services/api.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { LoaderService } from '../../core/services/loader.service';
import { take } from 'rxjs';
import { DashboardSummary } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, StatCardComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  metricModels: MetricModel[] = [];

  constructor(
    private loader: LoaderService,
    private dashboard:DashboardService){}

  ngOnInit(): void {
    this.loader.show();
    this.dashboard.getSummary().subscribe({
      next: (result: DashboardSummary) => {
        this.metricModels = result.metrics;
      },
      complete: () => this.loader.hide()
    })
  }
}
