import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricModel } from '../../core/models/metric-model';
import { StatCardComponent } from '../../shared/components/stat-card-component/stat-card-component';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, StatCardComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  metricModels: MetricModel[] = [
    {
      label: 'Total Balance',
      value: '৳ 500,000',
    },
    {
      label: 'Total Income',
      value: '৳ 150,000',
    },
    {
      label: 'Total Expenses',
      value: '৳ 100,000',
    },
    {
      label: 'Savings',
      value: '৳ 50,000',
    },
  ];

  ngOnInit(): void {
    
  }
}
