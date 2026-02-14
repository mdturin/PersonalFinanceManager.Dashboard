import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard';
import { TransactionContainerComponent } from './features/transactions/transaction-container-component';
import { AccountsContainerComponent } from './features/accounts/accounts-container.component';
import { LoginComponent } from './features/auth/login/login';
import { authGuard, unauthenticatedGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [unauthenticatedGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'accounts', component: AccountsContainerComponent, canActivate: [authGuard] },
  { path: 'transactions', component: TransactionContainerComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
