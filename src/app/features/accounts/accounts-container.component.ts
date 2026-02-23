import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../core/services/dialog.service';
import { Account } from '../../core/models/account.model';
import {
  AddAccountDialogComponent,
  AddAccountDialogData,
  AddAccountFormData,
} from './components/add-account-dialog/add-account-dialog';
import { MetricModel } from '../../core/models/metric-model';
import { StatCardComponent } from '../../shared/components/stat-card-component/stat-card-component';
import { AccountService } from '../../core/services/account-service';
import { SpinnerComponent } from '../../shared/components/spinner-component/spinner-component';

interface AccountInsight {
  title: string;
  description: string;
}

@Component({
  selector: 'app-accounts',
  imports: [CommonModule, StatCardComponent, SpinnerComponent],
  templateUrl: './accounts-container.component.html',
  styleUrls: ['./accounts-container.component.scss'],
})
export class AccountsContainerComponent implements OnInit {
  private accountsService = inject(AccountService);
  private dialogService = inject(DialogService);
  private cdr = inject(ChangeDetectorRef);

  isSummaryLoading = true;
  summary: MetricModel[] = [];

  isAccountsLoading = true;
  accounts: Account[] = [];

  isAccountMixLoading = true;
  accountMix: MetricModel[] = [];

  insights: AccountInsight[] = [
    {
      title: 'Upcoming payments',
      description: 'Two credit card payments due within 7 days.',
    },
    {
      title: 'Transfer suggestion',
      description: 'Move ৳ 8,000 into savings to hit your target.',
    },
    {
      title: 'Shared account alert',
      description: 'Family Expenses account dipped below ৳ 20,000 threshold.',
    },
  ];

  quickActions: string[] = ['Add account', 'Sync accounts', 'Export list', 'Set alerts'];

  ngOnInit(): void {
    this.accountsService.getAccountsSummary().subscribe({
      next: (summary: MetricModel[]) => {
        this.summary = summary;
        this.isSummaryLoading = false;
        this.cdr.markForCheck();
      },
    });

    this.accountsService.getAccounts().subscribe({
      next: (accounts: Account[]) => {
        this.accounts = accounts;
        this.isAccountsLoading = false;
        this.cdr.markForCheck();
      },
    });

    this.accountsService.getAccountMix().subscribe({
      next: (accountMix: MetricModel[]) => {
        this.accountMix = accountMix;
        this.isAccountMixLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  getStatusClass(isActive: boolean): string {
    switch (isActive) {
      case true:
        return 'badge-soft-success';
      case false:
        return 'badge-soft-warning';
      default:
        return 'badge-soft-muted';
    }
  }

  openAddAccountDialog() {
    const dialogRef = this.dialogService.openComponent<
      AddAccountDialogComponent,
      AddAccountDialogData,
      AddAccountFormData
    >({
      component: AddAccountDialogComponent,
      config: {
        width: '640px',
        maxWidth: '95vw',
      },
      data: {
        mode: 'create',
      },
    });

    dialogRef.subscribe((formData: AddAccountFormData) => {
      this.accounts = [{ ...formData }, ...this.accounts];
      this.cdr.markForCheck();
    });
  }

  openEditAccountDialog(account: Account) {
    const dialogRef = this.dialogService.openComponent<
      AddAccountDialogComponent,
      AddAccountDialogData,
      AddAccountFormData
    >({
      component: AddAccountDialogComponent,
      config: {
        width: '640px',
        maxWidth: '95vw',
      },
      data: {
        account,
        mode: 'edit',
      },
    });

    dialogRef.subscribe((formData: AddAccountFormData) => {
      this.accountsService.updateAccount(account.id, formData).subscribe({
        next: (updatedAccount: Account) => {
          this.accounts = this.accounts.map((currentAccount: Account) =>
            currentAccount.id === account.id
              ? { ...currentAccount, ...updatedAccount }
              : currentAccount,
          );
          this.cdr.markForCheck();
        },
      });
    });
  }

  deactivateAccount(account: Account) {
    this.accountsService.deactivateAccount(account.id).subscribe({
      next: () => {
        this.accounts = this.accounts.map((currentAccount: Account) =>
          currentAccount.id === account.id
            ? {
                ...currentAccount,
                isActive: false,
                updatedAt: new Date().toISOString(),
              }
            : currentAccount,
        );
        this.cdr.markForCheck();
      },
    });
  }

  handleQuickAction(action: string) {
    if (action === 'Add account') {
      this.openAddAccountDialog();
    }
  }
}
