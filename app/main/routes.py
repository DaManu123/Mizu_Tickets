from flask import flash, render_template
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import selectinload

from ..admin.forms import TicketStockForm
from ..models.event import Event

from . import bp


@bp.route("/")
def catalog():
    try:
        events = (
            Event.query.options(selectinload(Event.ticket_types))
            .filter_by(is_active=True)
            .order_by(Event.date.asc())
            .all()
        )
    except SQLAlchemyError:
        flash("No se pudo cargar el catalogo en este momento.", "error")
        events = []
    except Exception:
        flash("No se pudo cargar el catalogo en este momento.", "error")
        events = []

    return render_template("main/catalog.html", events=events)


@bp.route("/event/<int:id>")
def event_detail(id):
    try:
        event = (
            Event.query.options(selectinload(Event.ticket_types))
            .filter_by(id=id, is_active=True)
            .first_or_404()
        )
    except SQLAlchemyError:
        flash("No se pudo cargar el detalle del evento.", "error")
        return render_template("main/catalog.html", events=[])

    return render_template("main/event_detail.html", event=event, stock_form=TicketStockForm())
