import { Component, input } from '@angular/core';

/** Logo de PulseFit: cuadrado violeta con la línea de pulso centrada. */
@Component({
  selector: 'pf-logo',
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#4F35E8" />
      <path d="M10 32h10l5-9 8 23 7-28 5 14h9" fill="none" stroke="#fff"
        stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    @if (withName()) {
      <span class="name">PulseFit <span class="pro">Pro</span></span>
    }
  `,
  styles: `
    :host { display: inline-flex; align-items: center; gap: 10px; }
    svg { flex: none; }
    .name { font-size: 22px; font-weight: 850; letter-spacing: -.02em; }
    .pro { font-weight: 400; color: var(--ink2); }
  `,
})
export class Logo {
  readonly size = input(34);
  readonly withName = input(true);
}
