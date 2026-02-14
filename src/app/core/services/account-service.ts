import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Account } from '../models/account.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiService = inject(ApiService);
  private accountsEndpoint = '/api/accounts';

  getAccounts(): Observable<Account[]> {
    return this.apiService.get<Account[]>(this.accountsEndpoint);
  }
}
