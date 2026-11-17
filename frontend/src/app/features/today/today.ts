import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  LucideClock, LucideMoon, LucidePlus, LucideTriangleAlert, LucideUserPlus, LucideWallet,
} from '@lucide/angular';
import { AuthService } from '../../core/auth/auth.service';
import { Chart, ChartOption } from '../../shared/chart';
import { CountUp } from '../../shared/count-up';
import { formatEuros } from '../../shared/motion';
import { Ring } from '../../shared/ring';
import { KudosButton } from './kudos-button';
import { ActivityItem, Income } from './today.models';
import { TodayService } from './today.service';

const AVATAR_TONES = [
  ['#ECE9FF', '#4F35E8'], ['#DDF3E5', '#157A43'], ['#FCEFD6', '#9A5B00'],
  ['#FBE3E0', '#BE3A31'], ['#E2EEF8', '#215C8C'], ['#F1E6F6', '#7A3A93'],
] as const;

const AXIS = { axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false },
  axisLabel: { color: '#575D66', fontFamily: 'Archivo Variable', fontSize: 11 } };

@Component({
  selector: 'pf-today',
  imports: [
    Ring, Chart, CountUp, KudosButton,
    LucidePlus, LucideUserPlus, LucideClock, LucideWallet, LucideTriangleAlert, LucideMoon,
  ],
  templateUrl: './today.html',
  styleUrl: './today.css',
})
export class Today {
  private readonly auth = inject(AuthService);

  /** toSignal convierte el Observable del servicio en un signal que la plantilla lee directamente. */
  protected readonly data = toSignal(inject(TodayService).getToday());

  protected readonly firstName = computed(() => this.auth.user()?.name.split(' ')[0] ?? '');
  protected readonly today = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
    .format(new Date())
    .replace(/^./, (c) => c.toUpperCase());
  protected readonly greeting = greetingFor(new Date().getHours());

  protected readonly incomeChart = computed(() => {
    const income = this.data()?.income;
    return income ? incomeOption(income) : null;
  });

  protected incomePercent(i: Income): number {
    return Math.min(100, Math.round((i.collected / i.expected) * 100));
  }

  protected tone(clientId: number): readonly [string, string] {
    return AVATAR_TONES[clientId % AVATAR_TONES.length];
  }

  protected initials(name: string): string {
    return name.split(' ').map((p) => p[0]).join('').slice(0, 2);
  }

  /**
   * Opciones de cada mini gráfica, calculadas UNA vez por actividad.
   * Si se creasen en la plantilla con un método, cada repintado generaría un objeto
   * nuevo y la gráfica se redibujaría sin necesidad.
   */
  protected readonly activityCharts = computed(() => {
    const map = new Map<number, ChartOption>();
    for (const a of this.data()?.activity ?? []) map.set(a.id, activityOption(a));
    return map;
  });

  protected chartLabel(a: ActivityItem): string {
    return a.chart.kind === 'pace' ? `Ritmo por kilómetro de ${a.name}` : `Volumen por ejercicio de ${a.name}`;
  }

  protected formatDelta(kg: number): string {
    const abs = Math.abs(kg).toLocaleString('es-ES', { minimumFractionDigits: 1 });
    return `${kg > 0 ? '+' : '−'}${abs} kg`;
  }

  protected readonly euros = formatEuros;
}

function greetingFor(hour: number): string {
  if (hour < 14) return 'Buenos días';
  if (hour < 21) return 'Buenas tardes';
  return 'Buenas noches';
}

function incomeOption(i: Income): ChartOption {
  const last = i.months.length - 1;
  return {
    grid: { left: 0, right: 0, top: 10, bottom: 22 },
    tooltip: { trigger: 'axis', valueFormatter: (v: unknown) => formatEuros(Number(v)) },
    xAxis: { type: 'category', data: i.months.map((m) => m.label), ...AXIS },
    yAxis: { type: 'value', show: false },
    series: [{
      type: 'bar', barWidth: '52%',
      data: i.months.map((m, idx) => ({ value: m.amount, itemStyle: { color: idx === last ? '#4F35E8' : '#D9D3FF', borderRadius: 6 } })),
    }],
  };
}

function activityOption(a: ActivityItem): ChartOption {
  if (a.chart.kind === 'volume') {
    return {
      grid: { left: 0, right: 0, top: 6, bottom: 22 },
      tooltip: { trigger: 'axis', valueFormatter: (v: unknown) => `${Number(v).toLocaleString('es-ES')} kg` },
      xAxis: { type: 'category', data: a.chart.labels, ...AXIS, axisLabel: { ...AXIS.axisLabel, interval: 0 } },
      yAxis: { show: false },
      series: [{ type: 'bar', data: a.chart.values, barWidth: '46%', itemStyle: { color: '#4F35E8', borderRadius: 4 } }],
    };
  }
  const pace = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  return {
    grid: { left: 34, right: 6, top: 8, bottom: 22 },
    tooltip: { trigger: 'axis', valueFormatter: (v: unknown) => `${pace(Number(v))} /km` },
    xAxis: { type: 'category', data: a.chart.labels.map((k) => `km ${k}`), ...AXIS },
    // Eje invertido: un ritmo más rápido (menos segundos) sale más arriba.
    yAxis: { type: 'value', inverse: true, min: 315, max: 345, interval: 15, ...AXIS,
      axisLabel: { ...AXIS.axisLabel, formatter: (v: number) => pace(v) } },
    series: [{
      type: 'line', data: a.chart.secondsPerKm, smooth: 0.35, symbol: 'circle', symbolSize: 7,
      lineStyle: { width: 3, color: '#4F35E8' }, itemStyle: { color: '#4F35E8' },
    }],
  };
}
