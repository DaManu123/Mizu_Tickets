from flask import abort, flash, redirect, render_template, url_for
from flask_login import current_user, login_required

from ..extensions import db
from ..models.event import Event
from ..models.ticket_type import TicketType
from . import bp
from .forms import EventCreateForm


@bp.route("/create-event", methods=["GET", "POST"])
@login_required
def create_event():
    if current_user.role != "admin":
        abort(403)

    form = EventCreateForm()
    if form.validate_on_submit():
        event = Event()
        event.title = form.title.data
        event.description = form.description.data
        event.date = form.date.data
        event.venue = form.venue.data
        event.image_url = form.image_url.data
        event.is_active = True

        db.session.add(event)
        db.session.flush()

        ticket1 = TicketType()
        ticket1.event_id = event.id
        ticket1.name = form.ticket1_name.data
        ticket1.price = form.ticket1_price.data
        ticket1.stock_available = form.ticket1_stock.data

        ticket2 = TicketType()
        ticket2.event_id = event.id
        ticket2.name = form.ticket2_name.data
        ticket2.price = form.ticket2_price.data
        ticket2.stock_available = form.ticket2_stock.data

        ticket_types = [ticket1, ticket2]
        db.session.add_all(ticket_types)
        db.session.commit()

        flash("Evento creado exitosamente", "success")
        return redirect(url_for("main.event_detail", id=event.id))

    return render_template("admin/event_create.html", form=form)
