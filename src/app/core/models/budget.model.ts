export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  month: string;
  amount: number;
}

export interface BudgetProgress extends Budget {
  spent: number;
  remaining: number;
  projectedOverspend: number;
  progressPercent: number;
  threshold: 'safe' | 'warning' | 'high' | 'exceeded';
}

export interface BudgetFormData {
  categoryId: string;
  amount: number;
  month: string;
}
