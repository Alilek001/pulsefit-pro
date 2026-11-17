import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

/**
 * Interceptor: se ejecuta en CADA petición HTTP de la app.
 *
 * 1. Si hay sesión, añade la cabecera `Authorization: Bearer <token>` que pide Sanctum.
 *    Así ningún servicio tiene que acordarse de ponerla a mano.
 * 2. Si la API responde 401, el token ya no vale: cerramos la sesión y vamos al login.
 *
 * Solo toca peticiones a NUESTRA API, para no enviar el token a otros dominios.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.token();
  const isOurApi = req.url.startsWith(environment.apiUrl);

  const authReq = token && isOurApi
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
    : req;

  return next(authReq).pipe(
    catchError((err: unknown) => {
      if (isOurApi && err instanceof HttpErrorResponse && err.status === 401 && token) {
        auth.clearSession();
        void router.navigateByUrl('/login');
      }
      return throwError(() => err);
    }),
  );
};
