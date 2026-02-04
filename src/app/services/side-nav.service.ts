import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SideNavConfig } from '../models/side-nav.model';
import { ApiService } from './api.service';

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
            { label: 'Dashboard', href: '#', active: true },
            { label: 'Accounts', href: '#' },
            { label: 'Budgets', href: '#' },
            { label: 'Goals', href: '#' }
          ]
        },
        {
          title: 'Insights',
          items: [
            { label: 'Spending trends', href: '#' },
            { label: 'Cash flow', href: '#' },
            { label: 'Reports', href: '#' }
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
