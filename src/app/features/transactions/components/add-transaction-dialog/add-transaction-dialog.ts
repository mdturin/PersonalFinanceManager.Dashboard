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
import { Account } from '../../../../core/models/account.model';

export interface AddTransactionFormData {
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  date: string;
  categoryId: string;
  accountId: string;
  note: string;
}

export interface AddTransactionDialogData {
  accounts: Account[];
  categories: { id: number; name: string }[];
}

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
    MatSelectModule
  ],
  templateUrl: './add-transaction-dialog.html',
  styleUrl: './add-transaction-dialog.scss'
})
export class AddTransactionDialogComponent implements OnInit {
  private dialogRef = inject(
    MatDialogRef<AddTransactionDialogComponent, AddTransactionFormData>
  );
  private dialogData = inject<AddTransactionDialogData>(MAT_DIALOG_DATA);

  accounts = this.dialogData.accounts;
  categories = this.dialogData.categories;

  formData: AddTransactionFormData = this.getDefaultFormData();

  ngOnInit() {
    this.formData = this.getDefaultFormData();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close({ ...this.formData });
  }

  private getDefaultFormData(): AddTransactionFormData {
    const today = new Date().toISOString().split('T')[0];
    return {
      type: 'expense',
      amount: 0,
      date: today,
      categoryId: '',
      accountId: '',
      note: ''
    };
  }
}
