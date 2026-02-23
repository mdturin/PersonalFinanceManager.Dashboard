import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account, AccountType } from '../models/account.model';
import { ApiService } from './api.service';
import { MetricModel } from '../models/metric-model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiService = inject(ApiService);
  private accountsEndpoint = '/api/accounts';

  private static accountTypeMapper: { [key in string]: string } = {
    CreditCard: 'Credit Card',
  };

  static getAccountTypes(): { value: number; label: string }[] {
    return Object.keys(AccountType)
      .filter((key) => isNaN(Number(key))) // keep only enum names
      .map((key) => {
        const value = AccountType[key as keyof typeof AccountType];
        return {
          value,
          label: this.applyAccountTypeMapper(key),
        };
      });
  }

  private static applyAccountTypeMapper(key: string): string {
    // Handle special cases
    if (this.accountTypeMapper[key]) {
      return this.accountTypeMapper[key];
    }

    return key;
  }

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

  createAccount(payload: Partial<Account>): Observable<Account> {
    const accountEndpoint = `${this.accountsEndpoint}`;
    return this.apiService.post<Account>(accountEndpoint, payload);
  }

  updateAccount(accountId: string, payload: Partial<Account>): Observable<Account> {
    const accountEndpoint = `${this.accountsEndpoint}/${accountId}`;
    return this.apiService.put<Account>(accountEndpoint, payload);
  }

  deactivateAccount(accountId: string): Observable<void> {
    const deactivateEndpoint = `${this.accountsEndpoint}/${accountId}/deactivate`;
    return this.apiService.patch<void>(deactivateEndpoint, {});
  }

  activateAccount(accountId: string): Observable<void> {
    const activateEndpoint = `${this.accountsEndpoint}/${accountId}/activate`;
    return this.apiService.patch<void>(activateEndpoint, {});
  }

  deleteAccount(accountId: string): Observable<void> {
    const deleteEndpoint = `${this.accountsEndpoint}/${accountId}`;
    return this.apiService.delete<void>(deleteEndpoint);
  }
}
