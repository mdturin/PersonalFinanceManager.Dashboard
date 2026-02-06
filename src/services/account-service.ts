import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  getAccounts() {
    // Implementation to fetch accounts
    return of([]); // Placeholder for actual data
  }
}
