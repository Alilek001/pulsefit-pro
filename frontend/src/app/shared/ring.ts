import { afterNextRender, Component, computed, ElementRef, input, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { prefersReducedMotion } from './motion';

export type ClientState = 'ok' | 'warn' | 'risk';

const COLORS: Record<ClientState, string> = { ok: '#157A43', warn: '#C98300', risk: '#BE3A31' };

/** Anillo de preparación (0–100) que se dibuja al aparecer. El contenido va en el centro. */
@Component({
  selector: 'pf-ring',
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" [attr.viewBox]="'0 0 ' + size() + ' ' + size()" aria-hidden="true">
      <circle [attr.cx]="c()" [attr.cy]="c()" [attr.r]="r()" fill="none" stroke="#E6E8E3" [attr.stroke-width]="stroke()" />
      <circle #arc [attr.cx]="c()" [attr.cy]="c()" [attr.r]="r()" fill="none" [attr.stroke]="color()"
        [attr.stroke-width]="stroke()" stroke-linecap="round" [attr.transform]="'rotate(-90 ' + c() + ' ' + c() + ')'"
        [attr.stroke-dasharray]="length()" [attr.stroke-dashoffset]="length()" />
    </svg>
    <div class="center"><ng-content /></div>
  `,
  styles: `
    :host { position: relative; display: inline-grid; place-items: center; flex: none; }
    svg { position: absolute; inset: 0; }
    .center { position: relative; }
  `,
  host: { '[style.width.px]': 'size()', '[style.height.px]': 'size()' },
})
export class Ring {
  readonly score = input.required<number>();
  readonly state = input<ClientState>('ok');
  readonly size = input(48);
  readonly stroke = input(4);
  readonly delay = input(0);

  protected readonly c = computed(() => this.size() / 2);
  protected readonly r = computed(() => this.size() / 2 - this.stroke() / 2 - 1);
  protected readonly length = computed(() => 2 * Math.PI * this.r());
  protected readonly color = computed(() => COLORS[this.state()]);

  private readonly arc = viewChild.required<ElementRef<SVGCircleElement>>('arc');

  constructor() {
    afterNextRender(() => {
      // Un anillo a 0 no se vería: dejamos un mínimo visible para "sin datos".
      const shown = Math.max(this.score(), 6) / 100;
      const offset = this.length() * (1 - shown);
      if (prefersReducedMotion()) {
        this.arc().nativeElement.setAttribute('stroke-dashoffset', String(offset));
        return;
      }
      gsap.to(this.arc().nativeElement, {
        attr: { 'stroke-dashoffset': offset }, duration: 1.1, delay: this.delay(), ease: 'power3.out',
      });
    });
  }
}
