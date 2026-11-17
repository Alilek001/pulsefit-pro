import { afterNextRender, Component, DestroyRef, effect, ElementRef, inject, input } from '@angular/core';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

// Solo registramos lo que usamos: el paquete final pesa mucho menos que ECharts completo.
echarts.use([BarChart, LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

export type ChartOption = echarts.EChartsCoreOption;

/**
 * Envoltorio de ECharts para Angular.
 * Crea la gráfica cuando el elemento ya existe en la página, la actualiza cuando cambia
 * `option`, se adapta al tamaño del contenedor y se destruye al salir de la pantalla.
 */
@Component({
  selector: 'pf-chart',
  template: '',
  host: { role: 'img', '[attr.aria-label]': 'label()' },
  styles: ':host { display: block; width: 100%; }',
})
export class Chart {
  readonly option = input.required<ChartOption>();
  readonly label = input.required<string>();

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private chart?: echarts.ECharts;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.chart = echarts.init(this.el);
      this.chart.setOption(this.option());
      const observer = new ResizeObserver(() => this.chart?.resize());
      observer.observe(this.el);
      destroyRef.onDestroy(() => {
        observer.disconnect();
        this.chart?.dispose();
      });
    });

    effect(() => {
      const option = this.option();
      this.chart?.setOption(option, true);
    });
  }
}
