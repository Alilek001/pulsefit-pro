import { Component, computed, ElementRef, input, signal, viewChild } from '@angular/core';
import { LucideHeart } from '@lucide/angular';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../../shared/motion';

/** Botón "Dar ánimo" (como los kudos de Strava) con un pequeño estallido al pulsarlo. */
@Component({
  selector: 'pf-kudos-button',
  imports: [LucideHeart],
  template: `
    <button #btn type="button" class="kudo" [attr.aria-pressed]="given()" (click)="toggle()">
      <svg lucideHeart #heart></svg>
      <span>{{ given() ? 'Ánimo enviado' : 'Dar ánimo' }}</span>
      <span class="num count">{{ total() }}</span>
    </button>
  `,
  styles: `
    .kudo {
      position: relative; display: inline-flex; align-items: center; gap: 8px; min-height: 40px; padding: 0 14px;
      border: 1px solid var(--line); border-radius: 999px; background: var(--paper); color: var(--ink); font-weight: 600;
    }
    .kudo svg { width: 18px; height: 18px; }
    .kudo[aria-pressed="true"] { border-color: var(--violet); color: var(--violet); background: var(--violet-soft); }
    .kudo[aria-pressed="true"] svg { fill: var(--violet); }
    .count { color: var(--ink2); }
    :host ::ng-deep .burst {
      position: absolute; left: 22px; top: 50%; width: 6px; height: 6px; margin-top: -3px;
      border-radius: 50%; background: var(--violet); pointer-events: none;
    }
  `,
})
export class KudosButton {
  readonly initial = input.required<number>();
  protected readonly given = signal(false);
  protected readonly total = computed(() => this.initial() + (this.given() ? 1 : 0));

  private readonly btn = viewChild.required<ElementRef<HTMLButtonElement>>('btn');
  private readonly heart = viewChild.required('heart', { read: ElementRef });

  toggle(): void {
    this.given.update((v) => !v);
    if (prefersReducedMotion()) return;
    gsap.fromTo(this.heart().nativeElement, { scale: this.given() ? 0.6 : 1 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1.2,.4)' });
    if (!this.given()) return;
    const host = this.btn().nativeElement;
    for (let i = 0; i < 8; i++) {
      const dot = document.createElement('i');
      dot.className = 'burst';
      host.appendChild(dot);
      const angle = (i / 8) * Math.PI * 2;
      gsap.fromTo(dot, { x: 0, y: 0, opacity: 1, scale: 1 }, {
        x: Math.cos(angle) * 26, y: Math.sin(angle) * 26, opacity: 0, scale: 0.3,
        duration: 0.6, ease: 'power2.out', onComplete: () => dot.remove(),
      });
    }
  }
}
