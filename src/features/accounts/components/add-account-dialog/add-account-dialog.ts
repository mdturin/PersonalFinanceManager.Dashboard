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
import { Account, AccountStatus } from '../../../../models/account.model';

export type AddAccountFormData = Account;

export interface AddAccountDialogData {
  statuses?: AccountStatus[];
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
  private dialogRef = inject(
    MatDialogRef<AddAccountDialogComponent, AddAccountFormData>,
  );
  private dialogData = inject<AddAccountDialogData>(MAT_DIALOG_DATA);

  statusOptions: AccountStatus[] =
    this.dialogData?.statuses ?? ['Active', 'Needs attention', 'Inactive'];

  formData: AddAccountFormData = this.getDefaultFormData();

  ngOnInit() {
    this.formData = this.getDefaultFormData();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close({ ...this.formData });
  }

  private getDefaultFormData(): AddAccountFormData {
    return {
      name: '',
      type: '',
      institution: '',
      balance: '',
      status: 'Active',
      lastActivity: new Date().toLocaleDateString(),
    };
  }
}
