import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { MetricModel } from '../models/metric-model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  constructor(private api:ApiService){}

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
