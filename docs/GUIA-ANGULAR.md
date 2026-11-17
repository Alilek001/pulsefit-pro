# Guía del frontend Angular de PulseFit Pro

Esta guía explica cada pieza del frontend, en el orden en que conviene leer el código. Si vienes de Vue, al final hay una tabla de equivalencias.

## Arrancarlo

```bash
cd frontend
npm install
npm start          # http://localhost:4200
```

Necesitas el backend en `http://localhost:8000` (ver el README principal). La URL de la API está en `src/environments/environment.ts`. La de producción está en `environment.production.ts` y **hay que cambiarla** por la URL real de Render.

## Mapa de carpetas

```
src/
├─ environments/          URL de la API (desarrollo y producción)
├─ styles.css             Colores, botones, paneles… lo que se repite en toda la app
└─ app/
   ├─ app.config.ts       Configuración global: router, HttpClient e interceptor
   ├─ app.routes.ts       Rutas de la app
   ├─ core/
   │  ├─ models.ts        Tipos de datos que devuelve la API (User…)
   │  └─ auth/            Sesión: servicio, interceptor y guards
   ├─ layout/shell.*      Menú lateral + hueco donde se pintan las pantallas
   ├─ shared/             Piezas reutilizables: logo, anillo, gráfica, contador animado
   └─ features/
      ├─ auth/login.*     Pantalla de login
      └─ today/           Pantalla "Hoy" del entrenador
```

## Las piezas, una a una

### 1. Componentes standalone (`login.ts`, `today.ts`…)
Un componente es una clase con el decorador `@Component`. Su `imports: [...]` lista lo que usa su plantilla: otros componentes, directivas o iconos. No hay módulos (`NgModule`): cada componente declara lo suyo, y eso hace el código más fácil de seguir.

En Angular 22 los archivos ya no llevan el sufijo `.component`: `login.ts`, `login.html` y `login.css` son el mismo componente.

### 2. Signals (`signal`, `computed`, `effect`)
Es el estado reactivo, como `ref` y `computed` de Vue:

```ts
const sending = signal(false);      // crear
sending();                          // leer (¡con paréntesis!)
sending.set(true);                  // cambiar
const label = computed(() => sending() ? 'Entrando…' : 'Entrar');
```

`effect()` ejecuta código cada vez que cambian los signals que lee. Lo usamos en `chart.ts` para redibujar la gráfica cuando cambian sus datos.

### 3. Inyección de dependencias (`inject`)
Los servicios (`@Injectable({ providedIn: 'root' })`) los crea Angular **una sola vez** y te los da donde los pidas con `inject(AuthService)`. Así toda la app comparte la misma sesión sin pasarla de componente en componente. Es la misma idea que el contenedor de servicios de Laravel.

### 4. `AuthService` (`core/auth/auth.service.ts`)
Guarda el token de Sanctum y el usuario en signals y en `localStorage`. Expone `isLoggedIn` como `computed`, y los métodos `login()` y `logout()`. Desde fuera solo se puede **leer** la sesión (`asReadonly()`), así nadie la cambia por accidente.

### 5. Interceptor HTTP (`auth.interceptor.ts`)
Es una función que se ejecuta en **todas** las peticiones:
- Añade `Authorization: Bearer <token>` si la petición va a nuestra API.
- Si la API responde `401`, cierra la sesión y lleva al login.

Gracias a esto, ningún servicio tiene que acordarse de poner el token.

### 6. Guards (`auth.guard.ts`)
Deciden si se puede entrar en una ruta: `authGuard` protege la zona privada y `guestGuard` evita volver al login si ya tienes sesión. Devuelven `true` o una redirección (`createUrlTree`).

### 7. Rutas con carga diferida (`app.routes.ts`)
`loadComponent: () => import(...)` descarga el código de una pantalla **solo cuando se visita**. Por eso ECharts (pesado) no se descarga en el login. Puedes verlo en la salida de `ng build`: `today` es un *lazy chunk*.

### 8. Formularios reactivos (`login.ts`)
El formulario y sus validaciones se definen en TypeScript con `FormBuilder`. La plantilla solo se conecta con `formControlName`. Ventaja: es fácil de testear y las validaciones no están desperdigadas por el HTML.

### 9. Control de flujo en plantillas (`@if`, `@for`, `@switch`)
Sustituyen a `v-if` y `v-for`. En `@for` es **obligatorio** `track`, que es como el `:key` de Vue.

### 10. Datos de la pantalla Hoy (`today.service.ts`)
Ahora mismo devuelve **datos de ejemplo**, porque el backend aún no tiene endpoints de entrenador. El componente recibe un `Observable` y lo convierte en signal con `toSignal()`. Cuando exista el endpoint, se cambia **una línea** del servicio y la pantalla no se toca.

### 11. Gráficas y animaciones (`shared/`)
- `chart.ts`: envoltorio de ECharts. La crea con `afterNextRender` (cuando el elemento ya existe), la adapta al tamaño con `ResizeObserver` y la destruye al salir de la pantalla.
- `ring.ts`: anillo de preparación dibujado con GSAP.
- `count-up.ts`: directiva que anima números (`[pfCountUp]="1940"`).
- Todas respetan **"reducir movimiento"** del sistema operativo (`prefersReducedMotion()`).

## Vue ↔ Angular

| Vue | Angular |
|---|---|
| `ref(0)` | `signal(0)` |
| `computed(() => …)` | `computed(() => …)` |
| `watch` / `watchEffect` | `effect(() => …)` |
| `defineProps` | `input()` / `input.required()` |
| `defineEmits` | `output()` |
| `v-if` / `v-for` + `:key` | `@if` / `@for` + `track` |
| `@click` | `(click)` |
| `:prop="x"` | `[prop]="x"` |
| `onMounted` | `afterNextRender` |
| `provide/inject`, Pinia | servicios + `inject()` |
| axios + interceptores | `HttpClient` + `HttpInterceptorFn` |
| `router.beforeEach` | guards (`CanActivateFn`) |

## Tu primer ejercicio: la ficha del cliente

En el prototipo, al pulsar un nombre se abre un **panel lateral** con la ficha del cliente: peso, objetivo, cumplimiento, gráfica de peso y último check-in. Hazlo tú:

1. Crea `features/today/client-sheet.ts` como componente con un `input.required<number>()` para el `clientId` y un `output<void>()` llamado `closed`.
2. En `today.ts`, añade un signal `selectedClient = signal<number | null>(null)`. Convierte el nombre de cada fila en un `<button>` que haga `selectedClient.set(a.clientId)`.
3. En `today.html`, pinta el panel con `@if (selectedClient(); as id)`.
4. Usa `<pf-chart>` para la gráfica de peso, con datos de ejemplo en el servicio.
5. Accesibilidad: el panel lleva `role="dialog"` y `aria-modal="true"`, se cierra con Escape y devuelve el foco al botón que lo abrió.
6. Animación de entrada con GSAP, un deslizamiento desde la derecha, respetando `prefersReducedMotion()`.

Cuando lo tengas, compílalo con `npm run build` y pásamelo para revisarlo.
