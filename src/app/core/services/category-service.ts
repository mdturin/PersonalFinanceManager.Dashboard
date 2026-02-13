import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  getCategories() {
    return of([
      { id: 1, name: 'Food' },
      { id: 2, name: 'Salary' },
      { id: 3, name: 'Transfer' },
      { id: 4, name: 'Transport' },
      { id: 5, name: 'Freelance' },
      { id: 6, name: 'Shopping' },
    ]);
  }
}
