import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  getCategories() {
    // Implementation to fetch categories
    return of([]); // Placeholder for actual data
  }
}
