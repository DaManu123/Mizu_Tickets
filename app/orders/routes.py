from flask import flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required

from ..models.order import Order
from . import bp
from .services import process_purchase


@bp.route("/checkout", methods=["GET", "POST"])
@login_required
def checkout():
    if request.method == "GET":
        return render_template("orders/checkout.html")

    ticket_type_id = request.form.get("ticket_type_id", type=int)
    quantity = request.form.get("quantity", type=int)

    if not ticket_type_id or not quantity or quantity <= 0:
        flash("Selecciona un tipo de boleto y una cantidad valida.", "error")
        event_id = request.form.get("event_id", type=int)
        if event_id:
            return redirect(url_for("main.event_detail", id=event_id))
        return redirect(url_for("main.catalog"))

    result = process_purchase(current_user, ticket_type_id, quantity)
    if not result.ok:
        flash(result.error, "error")
        event_id = request.form.get("event_id", type=int)
        if event_id:
            return redirect(url_for("main.event_detail", id=event_id))
        return redirect(url_for("main.catalog"))

    flash("Compra exitosa!", "success")
    return redirect(url_for("orders.confirmation", order_id=result.order.id))


@bp.route("/confirmation/<int:order_id>")
@login_required
def confirmation(order_id):
    order = Order.query.filter_by(id=order_id, user_id=current_user.id).first_or_404()
    return render_template("orders/confirmation.html", order=order)
