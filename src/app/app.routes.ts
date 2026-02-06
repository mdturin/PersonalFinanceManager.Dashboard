import { Routes } from '@angular/router';
import { DashboardComponent } from '../features/dashboard/dashboard';
import { TransactionComponent } from '../features/transaction-component/transaction-component';

export const routes: Routes = [
	{ path: '', component: DashboardComponent },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'transactions', component: TransactionComponent },
	{ path: '**', redirectTo: '' }
];
