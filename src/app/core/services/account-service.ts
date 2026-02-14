import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../models/account.model';
import { ApiService } from './api.service';
import { MetricModel } from '../models/metric-model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiService = inject(ApiService);
  private accountsEndpoint = '/api/accounts';

  getAccounts(): Observable<Account[]> {
    return this.apiService.get<Account[]>(this.accountsEndpoint);
  }

  getAccountsSummary(): Observable<MetricModel[]> {
    const summaryEp = `${this.accountsEndpoint}/summary`;
    return this.apiService.get<MetricModel[]>(summaryEp);
  }

  getAccountMix(): Observable<MetricModel[]> {
    const accountMixEp = `${this.accountsEndpoint}/account-mix`;
    return this.apiService.get<MetricModel[]>(accountMixEp);
  }
}
