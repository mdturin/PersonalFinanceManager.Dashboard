import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export interface AddTransactionFormData {
  type: 'income' | 'expense' | 'transfer';
  amount: number | null;
  date: string;
  categoryId: string;
  accountId: string;
  toAccountId: string;
  note: string;
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
export class AddTransactionDialogComponent implements OnChanges {
  @Input({ required: true }) isOpen = false;
  @Input() accounts: Array<{ id: number; name: string }> = [];
  @Input() categories: Array<{ id: number; name: string }> = [];

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<AddTransactionFormData>();

  formData: AddTransactionFormData = this.getDefaultFormData();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen']?.currentValue) {
      this.formData = this.getDefaultFormData();
    }
  }

  closeDialog() {
    this.close.emit();
  }

  submit() {
    this.save.emit({ ...this.formData });
  }

  private getDefaultFormData(): AddTransactionFormData {
    const today = new Date().toISOString().split('T')[0];
    return {
      type: 'expense',
      amount: null,
      date: today,
      categoryId: '',
      accountId: '',
      toAccountId: '',
      note: ''
    };
  }
}
