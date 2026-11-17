import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { Logo } from '../../shared/logo';

@Component({
  selector: 'pf-login',
  imports: [ReactiveFormsModule, Logo],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /**
   * Formulario reactivo: la estructura y las validaciones se definen en TypeScript,
   * no en el HTML. `nonNullable` hace que los valores sean `string` y nunca `null`.
   */
  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected readonly sending = signal(false);
  protected readonly error = signal<string | null>(null);

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // muestra los errores de los campos vacíos
      return;
    }
    this.sending.set(true);
    this.error.set(null);
    const { email, password } = this.form.getRawValue();
    try {
      await this.auth.login(email, password);
      await this.router.navigateByUrl('/hoy');
    } catch (e) {
      this.error.set(messageFor(e));
    } finally {
      this.sending.set(false);
    }
  }
}

function messageFor(e: unknown): string {
  if (e instanceof HttpErrorResponse) {
    if (e.status === 422) return 'El email o la contraseña no son correctos.';
    if (e.status === 429) return 'Demasiados intentos. Espera un minuto y vuelve a probar.';
    if (e.status === 0) return 'No hay conexión con el servidor. Revisa tu internet y vuelve a intentarlo.';
  }
  return 'No se ha podido iniciar sesión. Vuelve a intentarlo en unos minutos.';
}
