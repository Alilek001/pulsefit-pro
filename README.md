# PulseFit Pro

Plataforma para entrenadores personales: gestionan a sus clientes, les asignan programas de entrenamiento, revisan sus check-ins semanales y cobran sus cuotas. Cada cliente tiene su propia app en el móvil para ver el entreno del día y registrar su progreso.

> **Estado:** en desarrollo. Es la evolución profesional de [PulseFit](https://github.com/Alilek001/pulsefit), mi proyecto de fin de ciclo de DAW.

## Stack

| Parte | Tecnología |
|---|---|
| Backend | PHP 8.4, Laravel 13, Sanctum (tokens), PostgreSQL |
| Frontend | Angular 22 (componentes standalone, signals, carga diferida), TypeScript estricto |
| Gráficas y animación | ECharts, GSAP |
| Despliegue | Docker (Render) · Vercel |

## Estructura

```
backend/    API REST en Laravel
frontend/   Aplicación Angular (panel del entrenador y app del cliente)
```

## Arrancar el backend en local

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

La cuenta de administrador de la demo no tiene contraseña pública: defínela con la variable `ADMIN_PASSWORD` antes de ejecutar el seeder.

## Arrancar el frontend en local

```bash
cd frontend
npm install
npm start   # http://localhost:4200
```

Cómo está organizado y qué hace cada pieza: [docs/GUIA-ANGULAR.md](docs/GUIA-ANGULAR.md).

## Hoja de ruta

- [x] Revisión de seguridad de la API heredada (permisos de admin, recetas por usuario, control del nivel Élite)
- [x] Base del frontend en Angular: login con Sanctum, interceptor, guards y diseño nuevo
- [x] Panel del entrenador «Hoy» (con datos de ejemplo hasta tener los endpoints)
- [ ] Ficha del cliente
- [ ] App del cliente (móvil)
- [ ] Roles de entrenador y cliente (multi-tenant por entrenador)
- [ ] Programas asignables y check-ins semanales
- [ ] Chat entrenador–cliente
- [ ] Cobros con Stripe
- [ ] Tests (Pest) e integración continua con GitHub Actions
