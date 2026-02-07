import { Routes } from '@angular/router';
import { DashboardComponent } from '../features/dashboard/dashboard';
import { TransactionContainerComponent } from '../features/transactions/transaction-container-component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'transactions', component: TransactionContainerComponent },
  { path: '**', redirectTo: '' },
];
