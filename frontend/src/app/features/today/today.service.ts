import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TodayData } from './today.models';

/**
 * Datos de la pantalla "Hoy".
 *
 * ⚠️ De momento devuelve DATOS DE EJEMPLO: el backend todavía no tiene los endpoints
 * de entrenador (clientes, check-ins, cobros). Cuando exista `GET /api/v1/trainer/today`,
 * solo hay que cambiar este método por:
 *
 *   return this.http.get<TodayData>(`${environment.apiUrl}/v1/trainer/today`);
 *
 * y el componente no cambia nada, porque ya trabaja con un Observable<TodayData>.
 */
@Injectable({ providedIn: 'root' })
export class TodayService {
  getToday(): Observable<TodayData> {
    return of(DEMO);
  }
}

const DEMO: TodayData = {
  summary: { activeClients: 18, trainingToday: 11, pendingCheckins: 4, weeklyCompliance: 86 },
  attention: [
    { clientId: 1, name: 'Pablo Sanz', state: 'risk', readiness: 0, kind: 'inactive',
      reason: 'Sin entrenar desde el miércoles pasado', tag: '6 días sin actividad' },
    { clientId: 2, name: 'Iván Torres', state: 'risk', readiness: 80, kind: 'payment',
      reason: 'Cuota de noviembre vencida el día 14', tag: 'Pago pendiente · 99 €' },
    { clientId: 3, name: 'Carmen Ortega', state: 'warn', readiness: 58, kind: 'injury',
      reason: 'Molestia en la rodilla en su check-in', tag: 'Revisar ejercicio' },
    { clientId: 4, name: 'Nerea Gil', state: 'warn', readiness: 41, kind: 'readiness',
      reason: 'Ha dormido 5 h, preparación baja', tag: 'Preparación 41' },
  ],
  income: {
    collected: 1940,
    expected: 2320,
    pendingNote: '3 cuotas pendientes, 1 vencida',
    months: [
      { label: 'jun', amount: 1480 }, { label: 'jul', amount: 1620 }, { label: 'ago', amount: 1710 },
      { label: 'sep', amount: 1890 }, { label: 'oct', amount: 2105 }, { label: 'nov', amount: 1940 },
    ],
  },
  checkins: [
    { clientId: 5, name: 'Lucía Martín', weightDelta: -0.4, quote: 'Me noto más fuerte en pierna, la sentadilla ya no me da miedo.' },
    { clientId: 4, name: 'Nerea Gil', weightDelta: -0.2, quote: 'Semana de turnos de noche, he comido peor de lo normal.' },
    { clientId: 3, name: 'Carmen Ortega', weightDelta: 0.1, quote: 'Me molesta la rodilla al bajar, ¿podemos cambiar algo?' },
    { clientId: 7, name: 'Sara Llopis', weightDelta: 0.2, quote: 'Feliz con el torso, el remo me sigue costando.' },
  ],
  activity: [
    { id: 1, clientId: 5, name: 'Lucía Martín', when: 'Hace 40 min', title: 'Pierna · Fuerza', kudos: 3,
      stats: [{ label: 'Duración', value: '52 min' }, { label: 'Volumen', value: '11.240 kg' }, { label: 'Récords', value: '2' }],
      chart: { kind: 'volume', labels: ['Sentadilla', 'P. muerto rum.', 'Prensa', 'Zancadas', 'Gemelo'], values: [4250, 2880, 2400, 1110, 600] } },
    { id: 2, clientId: 6, name: 'Daniel Ferrer', when: 'Hoy, 7:12', title: 'Rodaje suave', kudos: 5,
      stats: [{ label: 'Distancia', value: '6,2 km' }, { label: 'Tiempo', value: '34:10' }, { label: 'Ritmo', value: '5:31 /km' }],
      chart: { kind: 'pace', labels: ['1', '2', '3', '4', '5', '6'], secondsPerKm: [338, 333, 331, 329, 330, 323] } },
    { id: 3, clientId: 7, name: 'Sara Llopis', when: 'Ayer', title: 'Torso · Hipertrofia', kudos: 1,
      stats: [{ label: 'Duración', value: '47 min' }, { label: 'Volumen', value: '6.820 kg' }, { label: 'Récords', value: '0' }],
      chart: { kind: 'volume', labels: ['Press inclinado', 'Remo', 'Jalón', 'Elevaciones', 'Face pull'], values: [1980, 1760, 1540, 820, 720] } },
  ],
};
