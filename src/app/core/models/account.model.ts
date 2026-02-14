export type AccountStatus = 'Active' | 'Needs attention' | 'Inactive';

export interface Account {
  id: string;
  name: string;
  type: string;
  institution: string;
  currentBalance: string;
  isActive: boolean;
  updatedAt: string;
}
