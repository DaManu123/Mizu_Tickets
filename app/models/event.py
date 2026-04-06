from datetime import datetime

from ..extensions import db


class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)
    date = db.Column(db.DateTime, nullable=False, index=True)
    venue = db.Column(db.String(200), nullable=False)
    image_url = db.Column(db.String(500), nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True, index=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    ticket_types = db.relationship(
        "TicketType",
        back_populates="event",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def __repr__(self):
        return f"<Event {self.title}>"
