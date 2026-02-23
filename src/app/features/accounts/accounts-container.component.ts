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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { switchMap, take } from 'rxjs';
import { environment } from '../../../environments/environment';

interface AccountInsight {
  title: string;
  description: string;
}

@Component({
  selector: 'app-accounts',
  imports: [
    CommonModule,
    StatCardComponent,
    SpinnerComponent,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './accounts-container.component.html',
  styleUrls: ['./accounts-container.component.scss'],
})
export class AccountsContainerComponent implements OnInit {
  private accountsService = inject(AccountService);
  private dialogService = inject(DialogService);
  private cdr = inject(ChangeDetectorRef);

  isDevelopment = false;

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
    this.isDevelopment = environment.production === false;
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

  private openAccountDialog(account: Account | undefined, mode: 'create' | 'edit') {
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
        mode,
      },
    });

    return dialogRef.pipe(
      take(1),
      switchMap((formData: AddAccountFormData) => {
        if (mode === 'create') {
          return this.accountsService.createAccount(formData);
        } else if (mode === 'edit' && account) {
          return this.accountsService.updateAccount(account.id, formData);
        } else {
          throw new Error('Invalid dialog mode or missing account data');
        }
      }),
    );
  }

  openAddAccountDialog() {
    this.openAccountDialog(undefined, 'create').subscribe({
      next: (newAccount: Account) => {
        this.accounts = [{ ...newAccount }, ...this.accounts];
        this.cdr.markForCheck();
      },
    });
  }

  openEditAccountDialog(account: Account) {
    this.openAccountDialog(account, 'edit').subscribe({
      next: (updatedAccount: Account) => {
        this.accounts = this.accounts.map((currentAccount: Account) =>
          currentAccount.id === account.id ? updatedAccount : currentAccount,
        );
        this.cdr.markForCheck();
      },
    });
  }

  toggleAccountStatus(account: Account) {
    const accountStatusSubjet = account.isActive
      ? this.accountsService.deactivateAccount(account.id)
      : this.accountsService.activateAccount(account.id);

    accountStatusSubjet.subscribe({
      next: () => {
        this.accounts = this.accounts.map((currentAccount: Account) =>
          currentAccount.id === account.id
            ? {
                ...currentAccount,
                isActive: !currentAccount.isActive,
                updatedAt: new Date().toISOString(),
              }
            : currentAccount,
        );
        this.cdr.markForCheck();
      },
    });
  }

  deleteAccount(account: Account) {
    this.accountsService.deleteAccount(account.id).subscribe({
      next: () => {
        this.accounts = this.accounts.filter(
          (currentAccount: Account) => currentAccount.id !== account.id,
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
