from flask import abort, flash, render_template, request
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import selectinload

from ..admin.forms import TicketStockForm, ToggleEventForm
from ..models.event import Event

from flask_login import current_user

from . import bp


@bp.route("/")
def catalog():
    q = request.args.get("q", "").strip()
    if len(q) > 100:
        q = q[:100]

    try:
        events_query = Event.query.options(selectinload(Event.ticket_types)).filter_by(
            is_active=True
        )

        if q:
            search_pattern = f"%{q}%"
            events_query = events_query.filter(
                (Event.title.ilike(search_pattern)) | (Event.venue.ilike(search_pattern))
            )

        events = events_query.order_by(Event.date.asc()).all()
    except SQLAlchemyError:
        flash("No se pudo cargar el catalogo en este momento.", "error")
        events = []
    except Exception:
        flash("No se pudo cargar el catalogo en este momento.", "error")
        events = []

    return render_template("main/catalog.html", events=events, q=q)


@bp.route("/event/<int:id>")
def event_detail(id):
    try:
        # Load event regardless of is_active; authorization handled below
        event = (
            Event.query.options(selectinload(Event.ticket_types))
            .filter_by(id=id)
            .first_or_404()
        )
    except SQLAlchemyError:
        flash("No se pudo cargar el detalle del evento.", "error")
        return render_template("main/catalog.html", events=[])

    # If the event is inactive, only admins can view it
    if not event.is_active:
        if not current_user.is_authenticated or current_user.role != 'admin':
            abort(404)

    return render_template("main/event_detail.html", event=event, stock_form=TicketStockForm(), toggle_form=ToggleEventForm())
