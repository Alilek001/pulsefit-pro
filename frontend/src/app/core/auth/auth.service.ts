import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models';

interface LoginResponse {
  user: User;
  token: string;
}

const TOKEN_KEY = 'pf_token';
const USER_KEY = 'pf_user';

/**
 * Guarda la sesión del usuario (token de Sanctum + datos del usuario).
 *
 * - `providedIn: 'root'`: Angular crea UNA sola instancia para toda la app
 *   (patrón singleton) y la inyecta donde se pida con `inject(AuthService)`.
 * - El estado vive en *signals*: cuando cambian, cualquier plantilla que los lea
 *   se actualiza sola, igual que un `ref` de Vue.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(readStorage(TOKEN_KEY));
  private readonly _user = signal<User | null>(parseUser(readStorage(USER_KEY)));

  /** Solo lectura desde fuera: nadie más puede cambiar la sesión por accidente. */
  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._token() !== null);

  async login(email: string, password: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<LoginResponse>(`${environment.apiUrl}/login`, { email, password }),
    );
    this._token.set(res.token);
    this._user.set(res.user);
    writeStorage(TOKEN_KEY, res.token);
    writeStorage(USER_KEY, JSON.stringify(res.user));
  }

  /** Revoca el token en el backend (si se puede) y limpia la sesión local. */
  async logout(): Promise<void> {
    if (this._token()) {
      try {
        await firstValueFrom(this.http.post(`${environment.apiUrl}/logout`, {}));
      } catch {
        // Si el token ya no era válido da igual: cerramos la sesión igualmente.
      }
    }
    this.clearSession();
    await this.router.navigateByUrl('/login');
  }

  /** Lo usa el interceptor cuando la API responde 401 (token caducado o revocado). */
  clearSession(): void {
    this._token.set(null);
    this._user.set(null);
    removeStorage(TOKEN_KEY);
    removeStorage(USER_KEY);
  }
}

// localStorage puede no existir o lanzar error (modo privado, permisos): nunca rompemos la app por eso.
function readStorage(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function writeStorage(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* sin almacenamiento: la sesión dura lo que la pestaña */ }
}
function removeStorage(key: string): void {
  try { localStorage.removeItem(key); } catch { /* nada que limpiar */ }
}
function parseUser(raw: string | null): User | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as User; } catch { return null; }
}
