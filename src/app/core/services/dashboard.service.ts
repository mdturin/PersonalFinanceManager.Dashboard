import { inject, Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { MetricModel } from "../models/metric-model";

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private dashboardEndpoint = '/api/dashboard';
    private apiService = inject(ApiService);

    getSummary(): Observable<MetricModel[]> {
        const dashboardSummaryEndpoint = `${this.dashboardEndpoint}/summary`;
        return this.apiService.get<MetricModel[]>(dashboardSummaryEndpoint);
    }

    getTopExpenseCategories(): Observable<MetricModel[]> {
        const topExpenseCategoriesEndpoint = `${this.dashboardEndpoint}/top-expense-categories`;
        return this.apiService.get<MetricModel[]>(topExpenseCategoriesEndpoint);
    }

    getRecentTransactions(): Observable<MetricModel[]> {
        const recentTransactionsEndpoint = `${this.dashboardEndpoint}/recent-transactions`;
        return this.apiService.get<MetricModel[]>(recentTransactionsEndpoint);
    }
}