import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiService = inject(ApiService);
  private categoryEp = '/api/category';

  getCategories() {
    return this.apiService.get<Category[]>(this.categoryEp);
  }
}
