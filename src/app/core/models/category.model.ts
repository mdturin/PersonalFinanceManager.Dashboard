export interface Category {
  id: string;
  name: string;
  type: number;
}

export enum CategoryType {
  All = 0,
  Income = 1,
  Expense = 2,
}
