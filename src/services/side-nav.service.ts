import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { SideNavConfig } from '../models/side-nav.model';

@Injectable({
  providedIn: 'root'
})
export class SideNavService {
  private configEndpoint = '/api/config?type=side-nav';

  constructor(private apiService: ApiService) {}

  getSideNavConfig(): Observable<SideNavConfig> {
    return this.apiService.get<SideNavConfig>(this.configEndpoint).pipe(
      catchError(error => {
        console.error('Error fetching side-nav config:', error);

        // Return default config on error
        return of(this.getDefaultConfig());
      })
    );
  }

  private getDefaultConfig(): SideNavConfig {
    return {
      sections: [
        {
          title: 'Overview',
          items: [
            { label: 'Dashboard', route: '#', active: true },
            { label: 'Accounts', route: '#' },
            { label: 'Budgets', route: '#' },
            { label: 'Goals', route: '#' }
          ]
        },
        {
          title: 'Insights',
          items: [
            { label: 'Spending trends', route: '#' },
            { label: 'Cash flow', route: '#' },
            { label: 'Reports', route: '#' }
          ]
        }
      ],
      cards: [
        {
          title: 'Next steps',
          body: 'Connect your bank account to start importing transactions.',
          buttonLabel: 'Connect bank',
          buttonAction: 'connect-bank',
          hidden: true
        }
      ]
    };
  }
}
