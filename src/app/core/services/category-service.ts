import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Category, CategoryType } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiService = inject(ApiService);
  private categoryEp = '/api/category';

  static getCateogryTypes(): { value: number; label: string }[] {
    return Object.keys(CategoryType)
      .filter((key) => isNaN(Number(key))) // keep only enum names
      .map((key) => {
        const value = CategoryType[key as keyof typeof CategoryType];
        return {
          value,
          label: key,
        };
      });
  }

  getCategories() {
    return this.apiService.get<Category[]>(this.categoryEp);
  }

  addCategory(category: Partial<Category>) {
    return this.apiService.post<Category>(this.categoryEp, category);
  }
}
