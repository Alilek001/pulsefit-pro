/** true si el usuario ha pedido al sistema reducir animaciones. Todas las animaciones lo respetan. */
export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Formato español con punto de miles siempre (Intl no agrupa 4 cifras en es-ES: «1940»). */
export function formatNumber(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatEuros(n: number): string {
  return `${formatNumber(n)} €`;
}
