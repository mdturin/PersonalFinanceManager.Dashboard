import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { MetricModel } from '../models/metric-model';

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

  getTopExpenseCategories(): Observable<MetricModel[]> {
    return of([
      { label: 'Food', value: "৳ 18,200" },
      { label: 'Rent', value: "৳ 15,000" },
      { label: 'Transport', value: "৳ 6,300" },
      { label: 'Shopping', value: "৳ 5,100" }
    ] as MetricModel[]).pipe(delay(2000));
  }
}
