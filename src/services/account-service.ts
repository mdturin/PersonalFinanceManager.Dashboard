import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  getAccounts() {
    return of([
      { id: 1, name: 'Cash' },
      { id: 2, name: 'Bank' },
      { id: 3, name: 'Card' },
    ]);
  }
}
