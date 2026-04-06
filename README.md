# Mizu Tickets

Proyecto de venta de boletos con Flask (SSR), SQLAlchemy y SQLite.

## Requisitos

- Python 3.10+
- Entorno virtual recomendado (`.venv`)

## Instalacion y ejecucion

1. Crea y activa tu entorno virtual (`.venv`).
2. Instala dependencias:
   `pip install -r requirements.txt`
3. Crea tu archivo de entorno local:
   - copia `.env.example` a `.env`
   - define al menos `SECRET_KEY`
4. Aplica migraciones:
   `flask --app run.py db upgrade`
5. Ejecuta el proyecto:
   `python run.py`

Opcional (modo debug recomendado en desarrollo):
`flask --app run.py run --debug`

## Base de datos

- Motor: SQLite
- Archivo principal: `instance/app.db`

## Funcionalidades implementadas (Sprint 1)

- Registro, login y logout
- Catalogo de eventos
- Detalle de evento y seleccion de boletos
- Compra con descuento de stock en tiempo real
- Confirmacion de compra
- Panel admin para crear eventos con tipos de boletos iniciales

## Modelos principales

- `User` (1:N) `Order`
- `Event` (1:N) `TicketType`
- `Order` (1:N) `OrderItem`

Notas:
- `OrderItem` guarda `unit_price` y `subtotal` para historial inmutable.
- `Event` usa `is_active` para soft delete.

## Rutas principales

- `/` Catalogo
- `/event/<id>` Detalle de evento
- `/login` Login
- `/register` Registro
- `/checkout` Checkout/confirmacion de compra (POST)
- `/confirmation/<order_id>` Confirmacion
- `/admin/create-event` Crear evento (solo admin)

## Admin

Para ver "Crear evento" en el navbar, el usuario debe tener rol `admin`.
Ejemplo para cambiar rol:

`UPDATE users SET role = 'admin' WHERE email = 'tu_correo@ejemplo.com';`
