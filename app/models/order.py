from datetime import datetime

from ..extensions import db


class Order(db.Model):
    __tablename__ = "orders"
    __table_args__ = (
        db.CheckConstraint("total_amount >= 0", name="ck_orders_total_non_negative"),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    status = db.Column(db.String(20), nullable=False, default="confirmed", index=True)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, index=True)

    user = db.relationship("User", back_populates="orders")
    items = db.relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def __repr__(self):
        return f"<Order {self.id} user_id={self.user_id}>"
