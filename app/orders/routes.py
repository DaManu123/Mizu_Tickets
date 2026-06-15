import base64
from io import BytesIO

import qrcode
from flask import flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import joinedload

from ..models.order import Order
from ..models.order_item import OrderItem
from ..models.ticket_type import TicketType
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


@bp.route("/orders/<int:order_id>/receipt")
@login_required
def receipt(order_id):
    """Sirve el comprobante de compra (recibo) de una orden."""
    try:
        order = (
            Order.query.options(
                joinedload(Order.items)
                .joinedload(OrderItem.ticket_type)
                .joinedload(TicketType.event)
            )
            .filter_by(id=order_id)
            .first_or_404()
        )
        
        # Validar seguridad: solo el propietario de la orden o un admin puede verla
        if current_user.id != order.user_id and current_user.role != "admin":
            from flask import abort
            abort(403)

        qr = qrcode.QRCode(box_size=8, border=2)
        qr.add_data(order.receipt_code)
        qr.make(fit=True)

        qr_image = qr.make_image(fill_color="black", back_color="white")
        qr_buffer = BytesIO()
        qr_image.save(qr_buffer, format="PNG")
        qr_code_b64 = base64.b64encode(qr_buffer.getvalue()).decode("ascii")

        return render_template("orders/receipt.html", order=order, qr_code_b64=qr_code_b64)
    except SQLAlchemyError:
        flash("No se pudo cargar el comprobante.", "error")
        return redirect(url_for("orders.history"))
    except Exception:
        flash("No se pudo cargar el comprobante.", "error")
        return redirect(url_for("orders.history"))


@bp.route("/orders/history")
@login_required
def history():
    try:
        orders = (
            Order.query.options(
                joinedload(Order.items)
                .joinedload(OrderItem.ticket_type)
                .joinedload(TicketType.event)
            )
            .filter(Order.user_id == current_user.id)
            .order_by(Order.created_at.desc())
            .all()
        )
        return render_template("orders/history.html", orders=orders)
    except SQLAlchemyError:
        flash("No se pudo cargar tu historial en este momento.", "error")
        return render_template("orders/history.html", orders=[])
    except Exception:
        flash("No se pudo cargar tu historial en este momento.", "error")
        return render_template("orders/history.html", orders=[])
