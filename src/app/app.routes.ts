import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard';
import { TransactionContainerComponent } from './features/transactions/transaction-container-component';
import { AccountsComponent } from './features/accounts/accounts';
import { LoginComponent } from './features/auth/login/login';
import { authGuard, unauthenticatedGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [unauthenticatedGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [authGuard] },
  { path: 'transactions', component: TransactionContainerComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
