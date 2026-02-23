import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Account, AccountStatus } from '../../../../core/models/account.model';

export type AddAccountFormData = Account;

export interface AddAccountDialogData {
  statuses?: AccountStatus[];
  account?: Account;
  mode?: 'create' | 'edit';
}

@Component({
  selector: 'app-add-account-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './add-account-dialog.html',
  styleUrl: './add-account-dialog.scss',
})
export class AddAccountDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<AddAccountDialogComponent, AddAccountFormData>);
  private dialogData = inject<AddAccountDialogData>(MAT_DIALOG_DATA);

  statusOptions: AccountStatus[] = this.dialogData?.statuses ?? [
    'Active',
    'Needs attention',
    'Inactive',
  ];

  mode: 'create' | 'edit' = this.dialogData?.mode ?? 'create';

  formData: AddAccountFormData = this.getDefaultFormData();

  get title(): string {
    return this.mode === 'edit' ? 'Edit account' : 'Add account';
  }

  get subtitle(): string {
    return this.mode === 'edit'
      ? 'Update the account details.'
      : 'Capture the details for a new account.';
  }

  get submitButtonLabel(): string {
    return this.mode === 'edit' ? 'Save changes' : 'Add account';
  }

  ngOnInit() {
    this.formData = this.dialogData?.account
      ? { ...this.dialogData.account }
      : this.getDefaultFormData();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close({ ...this.formData });
  }

  private getDefaultFormData(): AddAccountFormData {
    return {
      id: '',
      name: '',
      type: '',
      institution: '',
      currentBalance: '0',
      isActive: true,
      updatedAt: new Date().toLocaleDateString(),
    };
  }
}
