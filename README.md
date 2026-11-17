# PulseFit Pro

Plataforma para entrenadores personales: gestionan a sus clientes, les asignan programas de entrenamiento, revisan sus check-ins semanales y cobran sus cuotas. Cada cliente tiene su propia app en el móvil para ver el entreno del día y registrar su progreso.

> **Estado:** en desarrollo. Es la evolución profesional de [PulseFit](https://github.com/Alilek001/pulsefit), mi proyecto de fin de ciclo de DAW.

## Stack

| Parte | Tecnología |
|---|---|
| Backend | PHP 8.4, Laravel 13, Sanctum (tokens), PostgreSQL |
| Frontend | Angular (componentes standalone, signals), TypeScript estricto |
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

## Hoja de ruta

- [x] Revisión de seguridad de la API heredada (permisos de admin, recetas por usuario, control del nivel Élite)
- [ ] Frontend en Angular con el nuevo diseño
- [ ] Roles de entrenador y cliente (multi-tenant por entrenador)
- [ ] Programas asignables y check-ins semanales
- [ ] Chat entrenador–cliente
- [ ] Cobros con Stripe
- [ ] Tests (Pest) e integración continua con GitHub Actions
