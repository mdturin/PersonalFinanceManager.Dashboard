export interface MetricModel {
  label: string;
  value: string;
  trend?: 'positive' | 'negative' | 'neutral';
  helper?: string;
}
