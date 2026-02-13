import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { DashboardSummary } from "../models/dashboard.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private dashboardEndpoint = '/api/dashboard';

    constructor(private apiService: ApiService) { }

    getSummary(): Observable<DashboardSummary> {
        return this.apiService.get<DashboardSummary>(this.dashboardEndpoint + "/summary");
    }
}