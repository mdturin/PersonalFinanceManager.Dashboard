import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { DashboardSummary } from "../models/dashboard.model";
import { Observable } from "rxjs";
import { MetricModel } from "../models/metric-model";

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private dashboardEndpoint = '/api/dashboard';

    constructor(private apiService: ApiService) { }

    getSummary(): Observable<DashboardSummary> {
        const dashboardSummaryEndpoint = `${this.dashboardEndpoint}/summary`;
        return this.apiService.get<DashboardSummary>(dashboardSummaryEndpoint);
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