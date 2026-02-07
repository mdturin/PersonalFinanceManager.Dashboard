import { Routes } from '@angular/router';
import { DashboardComponent } from '../features/dashboard/dashboard';
import { TransactionContainerComponent } from '../features/transactions/transaction-container-component';
import { AccountsComponent } from '../features/accounts/accounts';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'transactions', component: TransactionContainerComponent },
  { path: '**', redirectTo: '' },
];
