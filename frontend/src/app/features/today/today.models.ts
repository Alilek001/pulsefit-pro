import { ClientState } from '../../shared/ring';

export interface TodaySummary {
  activeClients: number;
  trainingToday: number;
  pendingCheckins: number;
  weeklyCompliance: number; // %
}

export interface AttentionItem {
  clientId: number;
  name: string;
  state: ClientState;
  readiness: number; // 0–100
  reason: string;
  tag: string;
  kind: 'inactive' | 'payment' | 'injury' | 'readiness';
}

export interface Income {
  collected: number;
  expected: number;
  pendingNote: string;
  months: { label: string; amount: number }[];
}

export interface CheckinItem {
  clientId: number;
  name: string;
  weightDelta: number; // kg
  quote: string;
}

export interface ActivityItem {
  id: number;
  clientId: number;
  name: string;
  when: string;
  title: string;
  stats: { label: string; value: string }[];
  chart:
    | { kind: 'volume'; labels: string[]; values: number[] }
    | { kind: 'pace'; labels: string[]; secondsPerKm: number[] };
  kudos: number;
}

export interface TodayData {
  summary: TodaySummary;
  attention: AttentionItem[];
  income: Income;
  checkins: CheckinItem[];
  activity: ActivityItem[];
}
