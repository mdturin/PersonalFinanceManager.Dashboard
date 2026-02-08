import { Component, Input } from '@angular/core';
import { MetricModel } from '../../../core/models/metric-model';


@Component({
  selector: 'app-stat-card-component',
  templateUrl: './stat-card-component.html',
  styleUrl: './stat-card-component.scss',
})
export class StatCardComponent {
  @Input() metric!: MetricModel;
  
}
