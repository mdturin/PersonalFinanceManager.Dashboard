import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AlertItem } from '../../core/models/alert.model';
import { AlertService } from '../../core/services/alert.service';
import { NotificationService } from '../../core/services/notification.service';
import { SpinnerComponent } from '../../shared/components/spinner-component/spinner-component';

@Component({
  selector: 'app-alerts',
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './alerts-container.component.html',
  styleUrl: './alerts-container.component.scss',
})
export class AlertsContainerComponent implements OnInit {
  private alertService = inject(AlertService);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
  alerts: AlertItem[] = [];

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.alertService.getAlerts().subscribe({
      next: (alerts) => {
        this.alerts = alerts;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.notificationService.error('Failed to load alerts.');
        this.cdr.markForCheck();
      },
    });
  }

  severityClass(alert: AlertItem): string {
    if (alert.severity === 'critical') {
      return 'border-danger';
    }

    if (alert.severity === 'warning') {
      return 'border-warning';
    }

    return 'border-info';
  }
}
