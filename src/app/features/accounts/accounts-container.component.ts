import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { DialogService } from '../../core/services/dialog.service';
import { Account } from '../../core/models/account.model';
import {
  AddAccountDialogComponent,
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

  quickActions: string[] = [
    'Add account',
    'Sync accounts',
    'Export list',
    'Set alerts'
  ];

  ngOnInit(): void {

    this.accountsService.getAccountsSummary()
      .subscribe({
        next: (summary: MetricModel[]) => {
          this.summary = summary;
          this.isSummaryLoading = false;
          this.cdr.markForCheck();
        }
      })

    this.accountsService.getAccounts()
      .subscribe({
        next: (accounts: Account[]) => {
          this.accounts = accounts;
          this.isAccountsLoading = false;
          this.cdr.markForCheck();
        }
      })
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
      undefined,
      AddAccountFormData
    >({
      component: AddAccountDialogComponent,
      showCloseButton: false,
      config: {
        width: '640px',
        maxWidth: '95vw',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(filter((result): result is AddAccountFormData => !!result))
      .subscribe((formData: AddAccountFormData) => {
        this.accounts = [{ ...formData }, ...this.accounts];
        this.cdr.markForCheck();
      });
  }

  handleQuickAction(action: string) {
    if (action === 'Add account') {
      this.openAddAccountDialog();
    }
  }
}
