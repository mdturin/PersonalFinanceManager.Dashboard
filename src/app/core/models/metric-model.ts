export interface MetricModel {
  label: string;
  value: string;
  icon?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  helper?: string;
}
