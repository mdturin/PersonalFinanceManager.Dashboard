import { ChangeDetectorRef, Component, inject } from '@angular/core';
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

interface AccountInsight {
  title: string;
  description: string;
}

@Component({
  selector: 'app-accounts',
  imports: [CommonModule, StatCardComponent],
  templateUrl: './accounts.html',
  styleUrls: ['./accounts.scss'],
})
export class AccountsComponent {
  private dialogService = inject(DialogService);
  private cdr = inject(ChangeDetectorRef);

  metrics: MetricModel[] = [
    {
      label: 'Total balance',
      value: '৳ 214,860',
      helper: 'Across 6 accounts',
      trend: 'positive',
    },
    {
      label: 'Monthly cash flow',
      value: '৳ 18,450',
      helper: 'Up 6% from last month',
      trend: 'positive',
    },
    {
      label: 'Credit utilization',
      value: '22%',
      helper: 'Healthy range',
      trend: 'neutral',
    },
    {
      label: 'Connected institutions',
      value: '3',
      helper: 'Last sync 2 hours ago',
      trend: 'neutral',
    },
  ];

  accounts: Account[] = [
    {
      id: '',
      name: 'Everyday Checking',
      type: 'Checking',
      institution: 'City Bank',
      balance: '৳ 48,320',
      status: 'Active',
      lastActivity: 'Today, 9:12 AM',
    },
    {
      id: '',
      name: 'High-Yield Savings',
      type: 'Savings',
      institution: 'Prime Credit Union',
      balance: '৳ 120,500',
      status: 'Active',
      lastActivity: 'Yesterday, 4:18 PM',
    },
    {
      id: '',
      name: 'Travel Rewards Card',
      type: 'Credit card',
      institution: 'Nova Bank',
      balance: '৳ 12,980',
      status: 'Needs attention',
      lastActivity: '2 days ago',
    },
    {
      id: '',
      name: 'Family Expenses',
      type: 'Joint checking',
      institution: 'City Bank',
      balance: '৳ 23,450',
      status: 'Active',
      lastActivity: '3 days ago',
    },
    {
      id: '',
      name: 'Emergency Fund',
      type: 'Savings',
      institution: 'Prime Credit Union',
      balance: '৳ 30,000',
      status: 'Active',
      lastActivity: 'Last week',
    },
    {
      id: '',
      name: 'Cash Wallet',
      type: 'Cash',
      institution: 'Offline',
      balance: '৳ 1,610',
      status: 'Inactive',
      lastActivity: '2 weeks ago',
    },
  ];

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

  getStatusClass(status: Account['status']): string {
    switch (status) {
      case 'Active':
        return 'badge-soft-success';
      case 'Needs attention':
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
