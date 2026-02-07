export type AccountStatus = 'Active' | 'Needs attention' | 'Inactive';

export interface Account {
  name: string;
  type: string;
  institution: string;
  balance: string;
  status: AccountStatus;
  lastActivity: string;
}
