export type AlertType = 'low-balance' | 'unusual-spending' | 'due-payment' | 'budget-threshold';

export interface AlertItem {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: string;
  source?: string;
}
