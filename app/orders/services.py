from decimal import Decimal

from sqlalchemy import update

from ..extensions import db
from ..models.order import Order
from ..models.order_item import OrderItem
from ..models.ticket_type import TicketType


class PurchaseResult:
    def __init__(self, ok, order=None, error=None):
        self.ok = ok
        self.order = order
        self.error = error


def process_purchase(user, ticket_type_id, quantity):
    ticket_type = db.session.get(TicketType, ticket_type_id)
    if ticket_type is None:
        return PurchaseResult(False, error="El tipo de boleto no existe.")

    if not ticket_type.event.is_active:
        return PurchaseResult(False, error="El evento no esta disponible.")

    try:
        # Actualizacion atomica de stock: solo funciona si hay inventario suficiente.
        stock_update = (
            update(TicketType)
            .where(TicketType.id == ticket_type.id)
            .where(TicketType.stock_available >= quantity)
            .values(stock_available=TicketType.stock_available - quantity)
        )
        result = db.session.execute(stock_update)

        affected_rows = int(getattr(result, "rowcount", 0) or 0)
        if affected_rows != 1:
            db.session.rollback()
            return PurchaseResult(False, error="Stock insuficiente.")

        unit_price = Decimal(ticket_type.price)
        subtotal = unit_price * quantity

        order = Order()
        order.user_id = user.id
        order.status = "confirmed"
        order.total_amount = subtotal
        db.session.add(order)
        db.session.flush()

        order_item = OrderItem()
        order_item.order_id = order.id
        order_item.ticket_type_id = ticket_type.id
        order_item.quantity = quantity
        order_item.unit_price = unit_price
        order_item.subtotal = subtotal
        db.session.add(order_item)

        db.session.commit()
        return PurchaseResult(True, order=order)
    except Exception:
        db.session.rollback()
        return PurchaseResult(False, error="No se pudo procesar la compra.")
