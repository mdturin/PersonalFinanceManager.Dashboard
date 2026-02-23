import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { SideNavConfig } from '../models/side-nav.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class SideNavService {
  private apiService = inject(ApiService);
  private notificationService = inject(NotificationService);

  private configEndpoint = '/api/config?type=side-nav';

  getSideNavConfig(): Observable<SideNavConfig> {
    return this.apiService.get<SideNavConfig>(this.configEndpoint).pipe(
      catchError(() => {
        this.notificationService.error(
          'Unable to load navigation configuration. Showing default navigation.',
        );
        return of(this.getDefaultConfig());
      }),
    );
  }

  private getDefaultConfig(): SideNavConfig {
    return {
      sections: [
        {
          title: 'Overview',
          items: [
            { label: 'Dashboard', route: '/dashboard', active: true },
            { label: 'Accounts', route: '/accounts' },
            { label: 'Budgets', route: '/budgets' },
            { label: 'Alerts', route: '/alerts' },
          ],
        },
        {
          title: 'Insights',
          items: [
            { label: 'Spending trends', route: '#' },
            { label: 'Cash flow', route: '#' },
            { label: 'Transactions', route: '/transactions' },
          ],
        },
      ],
      cards: [
        {
          title: 'Next steps',
          body: 'Connect your bank account to start importing transactions.',
          buttonLabel: 'Connect bank',
          buttonAction: 'connect-bank',
          hidden: true,
        },
      ],
    };
  }
}
