from flask import abort, flash, redirect, render_template, url_for, request
from flask_login import current_user, login_required
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import joinedload

from ..extensions import db
from ..models.event import Event
from ..models.ticket_type import TicketType
from . import bp
from .forms import EventCreateForm, EventEditForm, TicketStockForm, ToggleEventForm


def _require_admin():
    if current_user.role != "admin":
        abort(403)


@bp.route("/create-event", methods=["GET", "POST"])
@login_required
def create_event():
    _require_admin()

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


@bp.route("/edit-event/<int:event_id>", methods=["GET", "POST"])
@login_required
def edit_event(event_id):
    _require_admin()

    try:
        event = Event.query.filter_by(id=event_id, is_active=True).first_or_404()
    except SQLAlchemyError:
        flash("No se pudo cargar el evento para editar.", "error")
        return redirect(url_for("main.catalog"))

    form = EventEditForm(obj=event)
    if form.validate_on_submit():
        event.title = form.title.data
        event.description = form.description.data
        event.date = form.date.data
        event.venue = form.venue.data
        event.image_url = form.image_url.data

        try:
            db.session.commit()
            flash("Evento actualizado exitosamente", "success")
            return redirect(url_for("main.event_detail", id=event.id))
        except SQLAlchemyError:
            db.session.rollback()
            flash("No se pudo actualizar el evento.", "error")
        except Exception:
            db.session.rollback()
            flash("No se pudo actualizar el evento.", "error")

    return render_template("admin/event_edit.html", form=form, event=event)


@bp.route("/delete-event/<int:event_id>", methods=["POST"])
@login_required
def delete_event(event_id):
    _require_admin()
    form = ToggleEventForm()

    if form.validate_on_submit():
        try:
            event = Event.query.filter_by(id=event_id).first_or_404()
            event.is_active = False
            db.session.commit()
            flash("Evento ocultado exitosamente", "success")
        except SQLAlchemyError:
            db.session.rollback()
            flash("No se pudo ocultar el evento.", "error")
        except Exception:
            db.session.rollback()
            flash("No se pudo ocultar el evento.", "error")
    else:
        flash("Solicitud invalida.", "error")

    return redirect(request.referrer or url_for("admin.dashboard"))


@bp.route("/update-stock/<int:ticket_type_id>", methods=["POST"])
@login_required
def update_stock(ticket_type_id):
    _require_admin()

    form = TicketStockForm()

    try:
        ticket_type = TicketType.query.get_or_404(ticket_type_id)
    except SQLAlchemyError:
        flash("No se pudo cargar el tipo de boleto.", "error")
        return redirect(url_for("main.catalog"))

    if form.validate_on_submit():
        try:
            ticket_type.stock_available = form.stock.data
            db.session.commit()
            flash("Disponibilidad actualizada exitosamente", "success")
        except SQLAlchemyError:
            db.session.rollback()
            flash("No se pudo actualizar la disponibilidad.", "error")
        except Exception:
            db.session.rollback()
            flash("No se pudo actualizar la disponibilidad.", "error")
    else:
        flash("Ingresa un stock valido.", "error")

    return redirect(request.referrer or url_for("main.event_detail", id=ticket_type.event_id))


@bp.route('/dashboard')
@login_required
def dashboard():
    _require_admin()
    try:
        events = (
            Event.query.order_by(Event.date.desc()).all()
        )

        # compute stock_total for template convenience
        events_data = []
        for ev in events:
            stock_total = sum([tt.stock_available for tt in ev.ticket_types]) if ev.ticket_types else 0
            events_data.append({'event': ev, 'stock_total': stock_total})

        toggle_form = ToggleEventForm()
        stock_form = TicketStockForm()
        return render_template('admin/dashboard.html', events=events_data, toggle_form=toggle_form, stock_form=stock_form)
    except SQLAlchemyError:
        flash('No se pudo cargar el panel de administración.', 'error')
        return redirect(url_for('main.catalog'))



@bp.route('/toggle-event/<int:event_id>', methods=['POST'])
@login_required
def toggle_event(event_id):
    _require_admin()
    form = ToggleEventForm()

    try:
        event = Event.query.get_or_404(event_id)
    except SQLAlchemyError:
        flash('No se pudo cargar el evento.', 'error')
        return redirect(url_for('admin.dashboard'))

    if form.validate_on_submit():
        try:
            event.is_active = not event.is_active
            db.session.commit()
            if event.is_active:
                flash('Evento activado exitosamente', 'success')
            else:
                flash('Evento ocultado exitosamente', 'success')
        except SQLAlchemyError:
            db.session.rollback()
            flash('No se pudo actualizar el estado del evento.', 'error')
    else:
        flash('Solicitud invalida.', 'error')

    return redirect(request.referrer or url_for('admin.dashboard'))
