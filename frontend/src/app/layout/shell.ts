import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  LucideClipboardCheck, LucideDumbbell, LucideLogOut, LucideMessageCircle,
  LucideSettings, LucideSun, LucideUsers, LucideWallet,
} from '@lucide/angular';
import { AuthService } from '../core/auth/auth.service';
import { Logo } from '../shared/logo';

/**
 * Esqueleto de la zona privada: menú lateral + <router-outlet> donde se pintan
 * las pantallas hijas (Hoy, Clientes…). Se monta una vez y no se recarga al navegar.
 */
@Component({
  selector: 'pf-shell',
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive, Logo,
    LucideSun, LucideUsers, LucideDumbbell, LucideClipboardCheck,
    LucideMessageCircle, LucideWallet, LucideSettings, LucideLogOut,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  private readonly auth = inject(AuthService);
  protected readonly user = this.auth.user;
  protected readonly initials = computed(() =>
    (this.user()?.name ?? '')
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  );

  logout(): void {
    void this.auth.logout();
  }
}
