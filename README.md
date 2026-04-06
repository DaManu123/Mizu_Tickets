# Mizu Tickets - Sprint 1 (Phase 1)

Backend foundation for the Flask SSR migration.

## Setup

1. Create and activate your virtual environment.
2. Install dependencies:
   pip install -r requirements.txt
3. Initialize database migrations:
   flask --app run.py db init
4. Create first migration:
   flask --app run.py db migrate -m "Initial schema"
5. Apply migration:
   flask --app run.py db upgrade

## Core Data Model

- User (1:N) Order
- Event (1:N) TicketType
- Order (1:N) OrderItem

OrderItem stores `unit_price` and `subtotal` to preserve immutable purchase history.
Event includes `is_active` for soft-delete style behavior.
