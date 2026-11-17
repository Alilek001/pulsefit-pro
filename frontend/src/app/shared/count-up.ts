import { afterNextRender, Directive, effect, ElementRef, inject, input, untracked } from '@angular/core';
import { gsap } from 'gsap';
import { formatEuros, formatNumber, prefersReducedMotion } from './motion';

/**
 * Directiva: anima un número desde su valor anterior hasta el nuevo
 * (como los saldos de Revolut). Uso: <b [pfCountUp]="1940" format="eur"></b>
 */
@Directive({ selector: '[pfCountUp]' })
export class CountUp {
  readonly pfCountUp = input.required<number>();
  readonly format = input<'num' | 'eur'>('num');
  readonly suffix = input('');

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly state = { value: 0 };
  private ready = false;

  constructor() {
    afterNextRender(() => {
      this.ready = true;
      this.animateTo(untracked(this.pfCountUp));
    });
    // effect(): se vuelve a ejecutar cada vez que cambia un signal que lee (aquí, el valor).
    effect(() => {
      const target = this.pfCountUp();
      if (this.ready) this.animateTo(target);
    });
  }

  private animateTo(target: number): void {
    const render = () => {
      const text = this.format() === 'eur' ? formatEuros(this.state.value) : formatNumber(this.state.value);
      this.el.textContent = text + this.suffix();
    };
    if (prefersReducedMotion()) {
      this.state.value = target;
      render();
      return;
    }
    gsap.to(this.state, { value: target, duration: 1.4, ease: 'power3.out', onUpdate: render });
  }
}
