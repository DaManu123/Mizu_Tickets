from datetime import datetime

from ..extensions import db


class TicketType(db.Model):
    __tablename__ = "ticket_types"
    __table_args__ = (
        db.CheckConstraint("price >= 0", name="ck_ticket_types_price_non_negative"),
        db.CheckConstraint(
            "stock_available >= 0", name="ck_ticket_types_stock_non_negative"
        ),
        db.UniqueConstraint("event_id", "name", name="uq_ticket_types_event_name"),
    )

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False, index=True)
    name = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock_available = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    event = db.relationship("Event", back_populates="ticket_types")
    order_items = db.relationship("OrderItem", back_populates="ticket_type", lazy="dynamic")

    def __repr__(self):
        return f"<TicketType {self.name} event_id={self.event_id}>"
