import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guard';

/**
 * Cada pantalla se carga solo cuando se visita (`loadComponent`): el usuario
 * descarga menos código al entrar y ECharts solo llega cuando hace falta.
 */
export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    title: 'Entrar · PulseFit Pro',
    loadComponent: () => import('./features/auth/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell').then((m) => m.Shell),
    children: [
      {
        path: 'hoy',
        title: 'Hoy · PulseFit Pro',
        loadComponent: () => import('./features/today/today').then((m) => m.Today),
      },
      { path: '', pathMatch: 'full', redirectTo: 'hoy' },
    ],
  },
  { path: '**', redirectTo: '' },
];
