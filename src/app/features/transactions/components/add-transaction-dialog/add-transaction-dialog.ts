import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UtilityService } from '../../../../core/services/utility.service';
import {
  AddTransactionFormData,
  AddTransactionDialogData,
} from '../../../../core/models/transaction.model';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-add-transaction-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
  templateUrl: './add-transaction-dialog.html',
  styleUrl: './add-transaction-dialog.scss',
})
export class AddTransactionDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<AddTransactionDialogComponent, AddTransactionFormData>);
  private dialogData = inject<AddTransactionDialogData>(MAT_DIALOG_DATA);

  title = this.dialogData.title;
  accounts = this.dialogData.accounts;
  categories = this.dialogData.categories;
  transaction = this.dialogData.transaction;

  selectedCategory: Category | string = '';
  filteredCategories = [...this.categories];

  formData: AddTransactionFormData = this.getDefaultFormData();

  ngOnInit() {
    this.formData = this.getDefaultFormData();
  }

  filterCategories() {
    let categoryName = '';
    if (typeof this.selectedCategory !== 'string') {
      categoryName = this.selectedCategory.name;
    } else {
      categoryName = this.selectedCategory;
    }

    const val = categoryName.toLowerCase();
    this.filteredCategories = this.categories.filter((c) => c.name.toLowerCase().startsWith(val));
  }

  categoryExists(category: Category | string): boolean {
    let categoryName = '';
    if (typeof category !== 'string') {
      categoryName = category.name;
    } else {
      categoryName = category;
    }

    return this.categories.some((c) => c.name.toLowerCase() === categoryName.toLowerCase());
  }

  addCategory(categoryName: string) {
    const newCategory = {
      id: Date.now().toString(),
      name: categoryName,
    } as Category;

    this.categories = [...this.categories, newCategory];
    this.filteredCategories = [newCategory];

    this.formData.categoryId = newCategory.id;
    this.selectedCategory = newCategory;
  }

  onCategorySelected(event: any) {
    const value = event.option.value;

    if (typeof value === 'string') {
      this.addCategory(value);
    } else {
      this.formData.categoryId = value.id;
    }
  }

  displayCategory(category: any): string {
    return category?.name ?? category ?? '';
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close({ ...this.formData });
  }

  private getDefaultFormData(): AddTransactionFormData {
    const baseDate = this.transaction?.date ? new Date(this.transaction.date) : new Date();
    const today = UtilityService.formatDate(baseDate);

    return {
      type: this.transaction?.type?.toLowerCase() ?? 'expense',
      amount: this.transaction?.amount ?? 0,
      date: today,
      categoryId: this.transaction?.categoryId ?? '',
      accountId: this.transaction?.accountId ?? '',
      note: this.transaction?.description ?? '',
    };
  }
}
