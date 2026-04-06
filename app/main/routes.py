from flask import render_template

from ..models.event import Event

from . import bp


@bp.route("/")
def catalog():
    events = (
        Event.query.filter_by(is_active=True)
        .order_by(Event.date.asc())
        .all()
    )
    return render_template("main/catalog.html", events=events)


@bp.route("/event/<int:id>")
def event_detail(id):
    event = Event.query.filter_by(id=id, is_active=True).first_or_404()
    return render_template("main/event_detail.html", event=event)
