from datetime import datetime

from ..extensions import db


class OrderItem(db.Model):
    __tablename__ = "order_items"
    __table_args__ = (
        db.CheckConstraint("quantity > 0", name="ck_order_items_quantity_positive"),
        db.CheckConstraint("unit_price >= 0", name="ck_order_items_unit_price_non_negative"),
        db.CheckConstraint("subtotal >= 0", name="ck_order_items_subtotal_non_negative"),
    )

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False, index=True)
    ticket_type_id = db.Column(
        db.Integer,
        db.ForeignKey("ticket_types.id"),
        nullable=False,
        index=True,
    )
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    order = db.relationship("Order", back_populates="items")
    ticket_type = db.relationship("TicketType", back_populates="order_items")

    def __repr__(self):
        return f"<OrderItem order_id={self.order_id} ticket_type_id={self.ticket_type_id}>"
