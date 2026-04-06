from flask import flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required, login_user, logout_user

from ..extensions import db
from ..models.user import User
from . import bp
from .forms import LoginForm, RegistrationForm


def _normalize_email(value):
    return str(value or "").strip().lower()


def _normalize_text(value):
    return str(value or "").strip()


@bp.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("main.catalog"))

    form = RegistrationForm()
    if form.validate_on_submit():
        email = _normalize_email(form.email.data)
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            flash("Ese correo ya esta registrado.", "error")
            return redirect(url_for("auth.register"))

        user = User()
        user.name = _normalize_text(form.name.data)
        user.email = email
        user.set_password(str(form.password.data or ""))

        db.session.add(user)
        db.session.commit()

        flash("Registro exitoso. Ahora puedes iniciar sesion.", "success")
        return redirect(url_for("auth.login"))

    return render_template("auth/register.html", form=form)


@bp.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("main.catalog"))

    form = LoginForm()
    if form.validate_on_submit():
        email = _normalize_email(form.email.data)
        user = User.query.filter_by(email=email).first()

        if user is None or not user.check_password(str(form.password.data or "")):
            flash("Credenciales invalidas. Verifica correo y contrasena.", "error")
            return redirect(url_for("auth.login"))

        login_user(user)
        next_page = request.args.get("next")

        flash("Inicio de sesion exitoso.", "success")
        return redirect(next_page or url_for("main.catalog"))

    return render_template("auth/login.html", form=form)


@bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    flash("Sesion cerrada correctamente.", "success")
    return redirect(url_for("auth.login"))
